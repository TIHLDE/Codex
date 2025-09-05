---
tittel: Streaming av nettverkstrafikk med NGINX
---

_oppdatert 05.09.2025_

# Streaming av nettverkstrafikk med NGINX

I Drift håndterer vi mye forskjellig type nettverkstrafikk til mange forskjellige tjenester. 
*Chinstrap* er VM-instansen som all ekstern nettverkstrafikk treffer først, og bruker NGINX som en
revers proxy for å rute trafikken videre til riktig instans ut i fra type trafikk og destinasjon.

## Håndtering av HTTP trafikk

HTTP trafikk blir automatisk rutet til *adelie*-instansen, da denne kjører alle webtjenestene våre (oppgraderingen fra HTTP -> HTTPS håndteres av *adelie*).
Konfigurasjonsfilen for dette finner du i `/etc/nginx/sites-enabled/tihlde.org.conf` og per 05.09.2025 ser slik ut:

```nginx
server {
    listen 80;
    server_name phpmyadmin.tihlde.org phpmyadmin-dev.tihlde.org;

    location / {
        # Only allow connections from 10.0.0.0/8 (eduroam and NTNU VPN)
        allow 10.0.0.0/8;
        deny all;

        proxy_pass http://adelie;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name *.tihlde.org;

    location / {
        proxy_pass http://adelie;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Det som skjer her er at all HTTP trafikk på port 80 til `*.tihlde.org` blir rutet til *adelie*-instansen.
I tillegg er det en egen server-blokk for `phpmyadmin.tihlde.org` og `phpmyadmin-dev.tihlde.org` som kun tillater tilkoblinger fra
alle IP-adresser utenfor NTNU sitt nettverk (du kan fortsatt bruke NTNU sin VPN for å koble til disse tjenestene utenfor eduroam).

{% callout title="Filen er er symbolic link" type="warning" %}
Filen `/etc/nginx/sites-enabled/tihlde.org.conf` er en symbolic link til `/etc/nginx/sites-available/tihlde.org.conf`.
Dette gjør det mulig å slette symbolic linken for å skru av proxyingen for dette domene. Dette er standard praksis for NGINX på Debian-baserte systemer.
{% /callout %}

## Håndtering av HTTPS trafikk

I `/etc/nginx/nginx.conf` vil du finne følgende:

```nginx
stream {
    # Classify client IPs as eduroam or non-eduroam
    geo $is_eduroam {
        10.0.0.0/8      1;
        default         0;
    }

    # Decide destination based on SNI and client IP
    map "$ssl_preread_server_name:$is_eduroam" $https_destination {
        # Block phpmyadmin from non-eduroam source IPs
        "phpmyadmin-dev.tihlde.org:0"   reject;
        "phpmyadmin.tihlde.org:0"   	reject;

        # Default catch-all
        default                         192.168.0.41:443;
    }

    # HTTPS streaming
    server {
        listen 443;
        proxy_pass $https_destination;
        ssl_preread on;
    }

    #
    # ... andre stream konfigurasjoner ...
    #

}
```

Den første delen av denne konfigurasjonen klassifiserer IP-adressen til klienten som enten
*eduroam* (1) eller *non-eduroam* (0). Dette gjøres ved å sjekke om IP-adressen til klienten faller innenfor
CIDR-området `10.0.0.0/8`, som dekker alle IP-adresser som brukes av eduroam og NTNU sin VPN.

Den andre delen bruker `map`-direktivet for å bestemme hva som skal gjøres med tilkobleing ut i fra hvor klienten prøver å koble til
og om klienten er på eduroam eller ikke.

I dette eksempelet vil vi ikke tillate tilkoblinger til *phpmyadmin* dersom klienten ikke er på eduroam. Hvis SNI er `phpmyadmin.tihlde.org` eller `phpmyadmin-dev.tihlde.org`
og klienten ikke er på eduroam, vil tilkoblingen bli avvist (`reject`). For alle andre SNIer, vil trafikken bli videresendt til
*adelie*-instansen på port 443 (HTTPS).

## Håndtering av PostgreSQL, MySQL og Minecraft-server trafikk

For PostgreSQL, MySQL og Minecraft-server trafikk har vi lignende konfigurasjoner i samme `stream`-blokk i `/etc/nginx/nginx.conf`.

```nginx
stream {

    #
    # ... HTTPS konfigurasjon ...
    #

    # Minecraft Server streaming
    server {
        listen 25565;
        proxy_pass macaroni:25565;
        proxy_timeout 60s;
        proxy_connect_timeout 5s;
    }

    # PostgreSQL Streaming
    server {
        listen 5432;
        proxy_pass fiordland:5432;
        proxy_timeout 60s;
        proxy_connect_timeout 5s;

        allow 10.0.0.0/8;
        deny all;
    }

    # MySQL Streaming
    server {
        listen 3306;
        proxy_pass fiordland:3306;
        proxy_timeout 60s;
        proxy_connect_timeout 5s;

        allow 10.0.0.0/8;
        deny all;
    }

}
```

Her har vi server-blokker som lytter på portene 25565 (Minecraft), 5432 (PostgreSQL) og 3306 (MySQL).

For Minecraft-serveren blir all trafikk på port 25565 videresendt til *macaroni*-instansen på samme port.

For PostgreSQL og MySQL er det lagt til regler for å kun tillate tilkoblinger fra eduroam og NTNU sin VPN ved å bruke `allow` og `deny` direktivene.

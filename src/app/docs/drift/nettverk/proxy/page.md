_sist oppdatert: 2025-10-31 av Borgar_

# Nettverking og Chinstrap

## Oversikt

**Chinstrap** er TIHLDEs proxy-server som fungerer som inngangsport for all trafikk til våre tjenester. Alle forespørsler fra internett går først til Chinstrap, som deretter ruter trafikken videre til riktig VM basert på domenenavn, protokoll og nettverkstilgang. Disse VM-ene vil dermed motta trafikken og rute den til riktig Docker-container med egen Nginx.

## Chinstrap systemdetaljer

| Egenskap       | Verdi                    |
| -------------- | ------------------------ |
| VM-navn        | Chinstrap                |
| IPv4 (intern)  | 192.168.0.36             |
| IPv4 (ekstern) | 129.241.100.198          |
| Operativsystem | Debian 13 (trixie)       |
| Rolle          | Reverse proxy og gateway |

Chinstrap er den eneste VM-en som har en offentlig IP-adresse (`129.241.100.198`) som er tilgjengelig fra internett. Alle andre VM-er har kun private IP-adresser og kan bare nås via Chinstrap.

## Hvordan proxy-systemet fungerer

```
Internet → Chinstrap (129.241.100.198) → Riktig VM basert på domene/protokoll
                                            ├─ *.tihlde.org           → Adelie (192.168.0.41)
                                            ├─ vault.tihlde.org       → Royal (192.168.0.34)
                                            ├─ photon.tihlde.org      → King (192.168.0.6)
                                            ├─ mc.tihlde.org:25565    → Macaroni (192.168.0.84)
                                            └─ drift.tihlde.org:5432  → Fiordland (192.168.0.140)
```

Chinstrap bruker **Nginx** som reverse proxy og TCP stream proxy. Dette gjør at:

- Vi kan ha mange tjenester på forskjellige VM-er, men alle bruker samme offentlige IP
- Vi kan enkelt legge til/fjerne tjenester uten å endre DNS
- Vi kan implementere tilgangskontroll på ett sentralt sted
- SSL/TLS håndteres på hver VM (ikke på Chinstrap)

## HTTP-routing (port 80)

HTTP-trafikk på port 80 routes basert på `Host`-headeren (domenenavnet) i forespørselen.

### Nginx-konfigurasjon

Nginx-konfigurasjonen er delt opp i filer i `/etc/nginx/sites-enabled/`:

```bash
/etc/nginx/sites-enabled/
├── adelie.conf    # Routing til Adelie (wildcard + phpmyadmin)
├── king.conf      # Routing til King (photon.tihlde.org)
├── royal.conf     # Routing til Royal (vault.tihlde.org)
└── default        # Fallback-konfigurasjon
```

### Royal (vault.tihlde.org)

```nginx
server {
    listen 80;
    server_name vault.tihlde.org;

    location / {
        # Only allow connections from 10.0.0.0/8 (eduroam and NTNU VPN)
        allow 10.0.0.0/8;
        deny all;

        proxy_pass http://royal;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Forklaring:**

- Lytter på port 80 for domenet **vault.tihlde.org**
- Blokkerer all trafikk utenom `10.0.0.0/8` (eduroam og NTNU VPN)
- Sender godkjent trafikk videre til Royal

### King (photon.tihlde.org)

```nginx
server {
    listen 80;
    server_name photon.tihlde.org;

    location / {
        proxy_pass http://king;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Forklaring:**

- Lytter på port 80 for domenet **photon.tihlde.org**
- Ingen tilgangsbegrensning (åpen for alle)
- Sender trafikk videre til King

### Adelie (wildcard og phpmyadmin)

```nginx
# PHPMyAdmin - Restricted
server {
    listen 80;
    server_name phpmyadmin.tihlde.org phpmyadmin-dev.tihlde.org;

    location / {
        # Only allow connections from 10.0.0.0/8 (eduroam and NTNU VPN)
        allow 10.0.0.0/8;
        deny all;

        proxy_pass http://192.168.0.41;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Wildcard - All other *.tihlde.org domains
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

**Forklaring:**

- **PHPMyAdmin:** Beskyttet med IP-restriksjoner (kun eduroam/NTNU VPN)
- **Wildcard (`*.tihlde.org`):** Alle andre subdomener sendes til Adelie
  - Dette inkluderer **codex.tihlde.org**, **blitzed.tihlde.org**, **utlegg.tihlde.org**, osv.

## HTTPS-routing (port 443)

HTTPS-trafikk er mer kompleks fordi vi ikke kan lese `Host`-headeren uten å dekryptere SSL/TLS-trafikken først. I stedet bruker vi **SSL preread** for å lese SNI (Server Name Indication) som sendes i klartekst før kryptering starter.

### SSL Preread

SSL preread lar Nginx lese domenenavnet (SNI) fra HTTPS-forespørselen uten å dekryptere den. Dette gjør at vi kan route HTTPS-trafikk til riktig VM, og hver VM kan håndtere sin egen SSL/TLS-dekryptering.

### Tilgangskontroll med Geo-blokk

```nginx
geo $is_eduroam {
    10.0.0.0/8      1;
    default         0;
}
```

**Forklaring:**

Denne blokken klassifiserer klient-IP-adresser:

- Hvis IP-en er i `10.0.0.0/8` (eduroam eller NTNU VPN): `$is_eduroam = 1`
- Alle andre IP-adresser: `$is_eduroam = 0`

### Routing med Map-blokk

```nginx
map "$ssl_preread_server_name:$is_eduroam" $https_destination {
    # NOTE: We forward blocked connections to 127.0.0.1:9 as
    # port 9 is a special port designed for just voiding incoming packets

    # Block all non-eduroam/non-VPN requests for phpmyadmin
    "phpmyadmin-dev.tihlde.org:0"   127.0.0.1:9;
    "phpmyadmin.tihlde.org:0"       127.0.0.1:9;

    # Forward Vaultwarden requests to Royal, but block non-eduroam/non-VPN requests
    "vault.tihlde.org:0"            127.0.0.1:9;
    "vault.tihlde.org:1"            192.168.0.34:443;

    # Forward all Photon requests to King
    "photon.tihlde.org:1"           192.168.0.6:443;
    "photon.tihlde.org:0"           192.168.0.6:443;

    # Forward all other requests to Adelie as they are probably there
    default                         192.168.0.41:443;
}
```

**Forklaring:**

Map-blokken lager en ny variabel `$https_destination` basert på kombinasjonen av:

- `$ssl_preread_server_name`: Domenenavnet fra SNI (f.eks. `vault.tihlde.org`)
- `$is_eduroam`: Om klienten er på eduroam/VPN (`0` eller `1`)

**Eksempler:**

| Domene                | Fra eduroam/VPN? | Kombinasjon                   | Destinasjon        | Resultat                       |
| --------------------- | ---------------- | ----------------------------- | ------------------ | ------------------------------ |
| vault.tihlde.org      | Nei              | `vault.tihlde.org:0`          | `127.0.0.1:9`      | ❌ Blokkert (port 9 = discard) |
| vault.tihlde.org      | Ja               | `vault.tihlde.org:1`          | `192.168.0.34:443` | ✅ Sendt til Royal             |
| phpmyadmin.tihlde.org | Nei              | `phpmyadmin.tihlde.org:0`     | `127.0.0.1:9`      | ❌ Blokkert                    |
| phpmyadmin.tihlde.org | Ja               | (ingen match, bruker default) | `192.168.0.41:443` | ✅ Sendt til Adelie            |
| photon.tihlde.org     | Ja/Nei           | `photon.tihlde.org:*`         | `192.168.0.6:443`  | ✅ Sendt til King              |
| codex.tihlde.org      | Ja/Nei           | (ingen match, bruker default) | `192.168.0.41:443` | ✅ Sendt til Adelie            |

{% callout title="Port 9 - The Discard Port" type="note" %}
Port 9 er en spesiell port reservert for "discard protocol" som bare kaster bort alle pakker den mottar. Vi bruker denne til å "blokkere" forespørsler på en elegant måte uten at Nginx trenger å returnere en feilmelding.
{% /callout %}

### Stream Server for HTTPS

```nginx
server {
    listen 443;
    proxy_pass $https_destination;
    ssl_preread on;
    proxy_connect_timeout 1s;
}
```

**Forklaring:**

- Lytter på port 443 (HTTPS)
- Aktiverer SSL preread for å lese SNI
- Router trafikken til destinasjonen bestemt av `$https_destination` variabelen nevnt tidligere.

## TCP Stream Proxying

Chinstrap håndterer også TCP-trafikk som ikke er HTTP/HTTPS. Dette inkluderer Minecraft-serveren og databasene.

### Minecraft Server (port 25565)

```nginx
server {
    listen 25565;
    proxy_pass macaroni:25565;
    proxy_timeout 60s;
    proxy_connect_timeout 5s;
}
```

**Forklaring:**

- Lytter på port 25565 (standard Minecraft-port)
- Streamer all trafikk direkte til Macaroni på port 25565
- Ingen tilgangsbegrensninger (åpen for alle)

{% callout title="Minecraft og nettverking" type="note" %}
Minecraft-protokollen er ikke HTTP, så vi kan ikke bruke vanlig HTTP-proxy. I stedet streamer vi TCP-trafikken direkte til Macaroni.
{% /callout %}

### PostgreSQL (port 5432)

```nginx
server {
    listen 5432;
    proxy_pass fiordland:5432;
    proxy_timeout 60s;
    proxy_connect_timeout 5s;

    allow 10.0.0.0/8;
    deny all;
}
```

**Forklaring:**

- Lytter på port 5432 (standard PostgreSQL-port)
- Streamer trafikk til Fiordland på port 5432
- **Viktig:** Kun tilgjengelig fra eduroam/NTNU VPN (`10.0.0.0/8`)

### MariaDB (port 3306)

```nginx
server {
    listen 3306;
    proxy_pass fiordland:3306;
    proxy_timeout 60s;
    proxy_connect_timeout 5s;

    allow 10.0.0.0/8;
    deny all;
}
```

**Forklaring:**

- Lytter på port 3306 (standard MySQL/MariaDB-port)
- Streamer trafikk til Fiordland på port 3306
- **Viktig:** Kun tilgjengelig fra eduroam/NTNU VPN (`10.0.0.0/8`)

{% callout title="Database-sikkerhet" type="warning" %}
PostgreSQL og MariaDB er kun tilgjengelige fra eduroam og NTNU VPN. Dette er kritisk for sikkerheten, da databasene inneholder sensitiv data. Ikke fjern disse IP-restriksjonene uten å konsultere resten av Drift først.
{% /callout %}

## Tilgangskontroll-oversikt

| Tjeneste                | Port   | Tilgangskrav     | VM        |
| ----------------------- | ------ | ---------------- | --------- |
| Vaultwarden             | 443    | eduroam/NTNU VPN | Royal     |
| PHPMyAdmin              | 80/443 | eduroam/NTNU VPN | Adelie    |
| PostgreSQL              | 5432   | eduroam/NTNU VPN | Fiordland |
| MariaDB                 | 3306   | eduroam/NTNU VPN | Fiordland |
| Photon                  | 443    | Åpen             | King      |
| Minecraft               | 25565  | Åpen             | Macaroni  |
| Småtjenester (wildcard) | 443    | Åpen             | Adelie    |

## Nettverk-adresser

### Offentlig IP

- **129.241.100.198** - Chinstraps offentlige IP-adresse
- Alle domener (`*.tihlde.org`) peker til denne IP-en

### Private IP-adresser (internt nettverk)

| VM        | IPv4-adresse  | Domenenavn (intern) |
| --------- | ------------- | ------------------- |
| Chinstrap | 192.168.0.36  | chinstrap           |
| Adelie    | 192.168.0.41  | adelie              |
| Royal     | 192.168.0.34  | royal               |
| King      | 192.168.0.6   | king                |
| Fiordland | 192.168.0.140 | fiordland           |
| Macaroni  | 192.168.0.84  | macaroni            |

{% callout title="Intern DNS" type="note" %}
OpenStack har intern DNS som lar VM-er koble til hverandre via navn (f.eks. `adelie`, `royal`) i stedet for IP-adresser. Dette gjør konfigurasjonen enklere og mer lesbar.
{% /callout %}

## Feilsøking

### En nettside er ikke tilgjengelig

1. Sjekk at Chinstrap kjører: `ssh chinstrap` og `systemctl status nginx`
2. Sjekk at destinasjons-VM-en kjører og har riktig tjeneste aktiv
3. Sjekk Nginx-logger på Chinstrap og VM-en som hoster tjenesten: `tail -f /var/log/nginx/error.log`
4. Test Nginx-konfigurasjon: `nginx -t`

### Database-tilkobling feiler

1. Sjekk at du er på eduroam eller NTNU VPN
2. Sjekk at Fiordland kjører: `ssh fiordland`
3. Sjekk at PostgreSQL/MariaDB kjører på Fiordland
4. Test tilkobling med `psql` eller `mysql` fra en annen VM

### Endringer i Nginx-konfigurasjon

Etter endringer i Nginx-konfigurasjon:

```bash
# Test at konfigurasjonen er gyldig
nginx -t

# Hvis test er OK, reload Nginx
nginx -s reload

# Commit endringer til Git dersom mappen er git-tracket
git add .
git commit -m "[Ditt Navn] Beskrivelse av endring"
git push
```

{% callout title="Test alltid først" type="warning" %}
Kjør alltid `nginx -t` før du reloader Nginx. Hvis konfigurasjonen har syntaksfeil vil Nginx feile ved reload, og alle tjenester vil gå ned.
{% /callout %}

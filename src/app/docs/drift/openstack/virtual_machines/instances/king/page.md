# King

## Oversikt

King er en VM-instans på OpenStack som brukes til å hoste tjenestene til TIHLDE.

## Systemdetaljer

| Egenskap       | Verdi       |
| -------------- | ----------- |
| VM-navn        | King        |
| IPv4-adresse   | 192.168.0.6 |
| Operativsystem | Debian      |

## Nginx

King bruker **Nginx** som reverse proxy og TCP stream proxy. Dette gjør at:

- Vi kan ha mange tjenester på forskjellige VM-er, men alle bruker samme offentlige IP
- Vi kan enkelt legge til/fjerne tjenester uten å endre DNS
- Vi kan implementere tilgangskontroll på ett sentralt sted
- SSL/TLS håndteres sentralt
- Security through obscurity

### Konfigurasjon

Nginx-konfigurasjonen er delt opp i filer i `/etc/nginx/sites-enabled/`:

```bash
/etc/nginx/sites-enabled/
├── blitzed.tihlde.org.conf    # Routing til Blitzed containeren
├── codex.tihlde.org.conf      # Routing til Codex containeren
├── photon.tihlde.org.conf     # Routing til Photon containeren
├── ...
└── default                    # Fallback-konfigurasjon når ingenting matcher
```

### Eksempel: Blitzed (blitzed.tihlde.org)

```nginx
server {
  listen 80;
  server_name blitzed.tihlde.org;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl;
  http2 on;
  server_name blitzed.tihlde.org;

  ssl_certificate /etc/nginx/certificates/tihlde.org/fullchain.pem;
  ssl_certificate_key /etc/nginx/certificates/tihlde.org/privkey.pem;

  location / {
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
    proxy_redirect off;
  }
}

map $http_upgrade $connection_upgrade {
  default upgrade;
  ''      close;
}
```

**Forklaring:**

- Lytter på port 80 (HTTP) og 443 (HTTPS) for domenet **blitzed.tihlde.org**
- Videresender HTTP-trafikk til HTTPS
- SSL/TLS-sertifikater er konfigurert for `tihlde.org`
- Trafikk rutes til localhost på port 4000 hvor Blitzed containeren kjører

{% callout title="IP filtrering for eduroam" type="note" %}

Noen tjenester som Vaultwarden på Royal bruer IP-filtrering for å begrense tilgangen til
eduroam og NTNU VPN. Dette gjøres i Nginx-konfigurasjonen ved å sjekke klientens
IP-adresse:

```nginx
allow 10.0.0.0/8; # eduroam and NTNU VPN
deny all;         # Block all other IPs
```

{% /callout %}

## Forwarding av alt som ikke er HTTP/HTTPS

Noen tjenester bruker ikke HTTP/HTTPS, som for eksempel Minecraft-serveren og
databasene. For disse tjenestene bruker vi Nginx sin **stream**-modul i
**`/etc/nginx/nginx.conf`** for å proxy TCP- og UDP-trafikk direkte til riktig VM og
port.

### Eksempel

```nginx
stream {
    # PostgreSQL Streaming
    server {
	    listen 5432;

	    # Address of Fiordland VM and PostgreSQL port
	    proxy_pass 192.168.0.140:5432;
	    proxy_timeout 60s;
	    proxy_connect_timeout 5s;

        # Allow only eduroam and NTNU VPN traffic
	    allow 10.0.0.0/8;
        deny all;
    }

    ...
}
```

**Forklaring:**

- Lytter på port 5432 (PostgreSQL)
- Router trafikken til destinasjonen bestemt av `proxy_pass`.
- Setter tidsavbrudd for tilkobling og dataoverføring
- Implementerer IP-basert tilgangskontroll for å begrense tilgangen til eduroam og NTNU
  VPN

{% callout title="IP-adresser i stream-modulen" type="warning" %}

Merk at man ikke kan bruke instansnavn (f.eks. `fiordland`) i `proxy_pass` i
stream-modulen. Man må bruke den interne IP-adressen til VM-en.

{% /callout %}

## Docker

Hvis du kjører `docker ps` på King, vil du se en rekke containere som kjører de
forskjellige tjenestene:

```
...
debian@king:~$ docker ps
CONTAINER ID   IMAGE                            COMMAND                  CREATED        STATUS          PORTS                       NAMES
3c9b140413f7   ghcr.io/tihlde/photon            "sh -c 'bun run ./ap…"   18 hours ago   Up 18 hours     127.0.0.1:4000->4000/tcp    Photon
09554e092038   ghcr.io/tihlde/drift-backend     "docker-entrypoint.s…"   18 hours ago   Up 18 hours     127.0.0.1:9801->3000/tcp    drift-backend
820d49e6ab90   ghcr.io/tihlde/fondet:latest     "docker-entrypoint.s…"   19 hours ago   Up 14 hours     127.0.0.1:1440->3000/tcp    fondet
22d50116bfc6   ghcr.io/tihlde/proton:latest     "docker-entrypoint.s…"   24 hours ago   Up 17 hours     127.0.0.1:6969->3000/tcp    Proton
```

Her ser vi at tjenesten **Photon** kjører i en Docker-container, og er tilgjengelig fra
`127.0.0.1` (localhost) på port 4000. Når Nginx mottar en forespørsel for
photon.tihlde.org, vil den rute denne forespørselen til localhost på port 4000, hvor
Docker-containeren er.

## acme.sh

King bruker acme.sh for å håndtere TLS-sertifikater. Acme.sh bruker domeneshop
API-nøkler for å fornye sertifikatene når de nærmer seg utløpsdato. Du kan se
sertifikatene slik:

```
debian@king:~$ acme.sh list
Main_Domain  KeyLength  SAN_Domains   Profile  CA               Created               Renew
tihlde.org   "ec-256"   *.tihlde.org           LetsEncrypt.org  2026-08-29T21:03:52Z  2026-10-28T13:08:17Z
```

TlS-sertifikatene er installert under `/etc/nginx/certificates/<domene>/<TLS-fil>`.

{% callout title="TLS-sertifikat installering" type="warning" %}

Merk at sertifikatene ble puttet i `/etc/nginx/certificates/<domene>/<TLS-fil>` gjennom
```bash acme.sh --install-cert <masse-args>``` kommandoen slik at acme.sh vet hvor de
ligger og kan legge inn de nye når de blir fornyet, og automatisk reload'e Nginx. *Ikke*
bare putt TLS-sertifikat filer der med `cp` eller `mv`.

{% /callout %}

Domeneshop API-nøklene ligger under `~/.acme.sh/account.conf`.

## Cronjobs

King har cronjobs som kjører regelmessig. Disse cronjobbene kan sees ved å kjøre
`crontab -l`, eller redigeres med `crontab -e`.

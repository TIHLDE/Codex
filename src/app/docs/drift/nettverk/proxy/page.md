# Nettverking og Chinstrap

## Oversikt

**Chinstrap** er TIHLDEs proxy-server som fungerer som inngangsport for all trafikk til våre tjenester. Alle forespørsler fra internett går først til Chinstrap, som deretter ruter trafikken videre til riktig Docker container basert på domenenavn, protokoll og nettverkstilgang.

## Chinstrap systemdetaljer

| Egenskap       | Verdi                    |
| -------------- | ------------------------ |
| VM-navn        | Chinstrap                |
| IPv4 (intern)  | 192.168.0.36             |
| IPv4 (ekstern) | 129.241.100.198          |
| Operativsystem | Debian                   |
| Rolle          | Reverse proxy og gateway |

Chinstrap er en av få VM-er som har en offentlig IP-adresse (`129.241.100.198`) som er tilgjengelig fra internett. Nesten alle andre VM-er har kun private IP-adresser og kan bare nås via Chinstrap.

## Hvordan proxy-systemet fungerer

Chinstrap bruker **Nginx** som reverse proxy og TCP stream proxy. Dette gjør at:

- Vi kan ha mange tjenester på forskjellige VM-er, men alle bruker samme offentlige IP
- Vi kan enkelt legge til/fjerne tjenester uten å endre DNS
- Vi kan implementere tilgangskontroll på ett sentralt sted
- SSL/TLS håndteres sentralt
- Security through obscurity

### Nginx-konfigurasjon

Nginx-konfigurasjonen er delt opp i filer i `/etc/nginx/sites-enabled/`:

```bash
/etc/nginx/sites-enabled/
├── blitzed.tihlde.org.conf    # Routing til Blitzed containeren på Adelie
├── codex.tihlde.org.conf      # Routing til Codex containeren på Adelie
├── photon.tihlde.org.conf     # Routing til Photon containeren på King
├── ...
└── default                    # Fallback-konfigurasjon når ingenting matcher
```

### Blitzed (blitzed.tihlde.org)

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
    proxy_pass http://adelie:4000;
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
- Trafikk rutes til Adelie på port 4000 hvor Blitzed containeren kjører

{% callout title="IP filtrering for eduroam" type="note" %}
Noen tjenester som Vaultwarden på Royal bruer IP-filtrering for å begrense tilgangen til eduroam og NTNU VPN. Dette gjøres i Nginx-konfigurasjonen ved å sjekke klientens IP-adresse:

```nginx
allow 10.0.0.0/8; # eduroam and NTNU VPN
deny all;         # Block all other IPs
```

{% /callout %}

## Forwarding av alt som ikke er HTTP/HTTPS

Noen tjenester bruker ikke HTTP/HTTPS, som for eksempel Minecraft-serveren og databasene. For disse tjenestene bruker vi Nginx sin **stream**-modul for å proxy TCP- og UDP-trafikk direkte til riktig VM og port.

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
- Implementerer IP-basert tilgangskontroll for å begrense tilgangen til eduroam og NTNU VPN

{% callout title="IP-adresser i stream-modulen" type="warning" %}

Merk at man ikke kan bruke instansnavn (f.eks. `fiordland`) i `proxy_pass` i stream-modulen. Man må bruke den interne IP-adressen til VM-en.

{% /callout %}

## Nettverk-adresser

### Offentlig IP

- **129.241.100.198** - Chinstraps offentlige IP-adresse

- Alle domener (`*.tihlde.org`) peker til denne IP-en. Dette er konfigurert i Domeneshop.

## Feilsøking

### En nettside er ikke tilgjengelig

1. Sjekk at Chinstrap kjører: `ssh chinstrap` og `systemctl status nginx`
2. Sjekk at docker containeren for tjenesten kjører på 192.168.0.X:<PORT> og ikke 127.0.0.1:<PORT>
3. Sjekk at destinasjons-VM-en kjører og har riktig tjeneste aktiv
4. Sjekk Nginx-logger på Chinstrap og VM-en som hoster tjenesten: `tail -f /var/log/nginx/error.log`
5. Test Nginx-konfigurasjon: `nginx -t`

### Endre Nginx-konfigurasjon

Etter endringer i Nginx-konfigurasjon:

```bash
# Test at konfigurasjonen er gyldig
sudo nginx -t

# Hvis test er OK, reload Nginx
sudo systemctl reload nginx
```

{% callout title="Test alltid først" type="warning" %}
Kjør alltid `sudo nginx -t` før du reloader Nginx. Hvis konfigurasjonen har syntaksfeil vil Nginx feile ved reload, og bortimot alle tjenester vil gå ned.
{% /callout %}

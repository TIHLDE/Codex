_sist oppdatert: 2025-10-30 av Borgar_

# King

## Oversikt

King er en VM-instans på OpenStack som brukes til å hoste **Photon**, TIHLDEs nye backend-applikasjon. Siden Photon er kritisk infrastruktur for TIHLDE har den fått en egen dedikert instans.

## Systemdetaljer

| Egenskap       | Verdi              |
| -------------- | ------------------ |
| VM-navn        | King               |
| IPv4-adresse   | 192.168.0.6        |
| Domene         | photon.tihlde.org  |
| Operativsystem | Debian 13 (trixie) |

## SSH-konfigurasjon

### Automatisk root-bytte

Når du SSH-er inn på King blir du automatisk switchet fra **debian**-brukeren til **root**-brukeren, på samme måte som på de andre VM-ene.

{% callout title="Root-tilgang" type="warning" %}
Du får automatisk root-tilgang ved innlogging. Vær ekstra forsiktig med kommandoer du kjører, spesielt siden King hoster Photon som er kritisk infrastruktur for TIHLDE.
{% /callout %}

## Nettverkskonfigurasjon

King mottar all innkommende trafikk fra proxy-instansen **Chinstrap**. VM-en bruker **Nginx** for å route denne trafikken videre til Photon-containeren.

{% callout title="Les mer om nettverket" type="note" %}
Se dokumentasjonen for "Nettverking" for å lese mer om hvordan Nginx og nettverkingen fungerer.
{% /callout %}

## TLS-sertifikater

King bruker **acme.sh** for å håndtere TLS-sertifikater for domenene. Sertifikatene fornyes automatisk gjennom Domeneshop sitt API, på samme måte som på Adelie.

## Photon (Backend)

### Prosjektstruktur

Photon sine prosjektfiler ligger i `/root/photon/` og kjører i en Docker-container. Prosjektmappen inneholder:

- Prosjektets kildefiler
- Docker-konfigurasjon

### Deployment

Photon deployes automatisk via GitHub workflows som SSH-er seg inn på King og kjører deployment. Dette håndterer stopp av gammel container og oppstart av ny, oppdatert versjon.

{% callout title="Deployment" type="note" %}
Deployment-prosessen håndteres automatisk av GitHub workflows. Du trenger normalt ikke å deploye manuelt.
{% /callout %}

## Redis

King kjører **Redis** som en systemd-tjeneste. Redis brukes av Photon for caching og session-håndtering.

### Redis-konfigurasjon

Redis kjører med standard konfigurasjon, bortsett fra to viktige endringer i `/etc/redis/redis.conf`:

#### Nettverkstilgang (bind)

```conf
# [borgar] added 172.17.0.1 to allow docker container to connect
bind 127.0.0.1 -::1 172.17.0.1
```

**Hva betyr disse adressene?**

| Adresse    | Betydning                                                               |
| ---------- | ----------------------------------------------------------------------- |
| 127.0.0.1  | Localhost IPv4 (lokale tilkoblinger på VM-en)                           |
| -::1       | Localhost IPv6 (minus-tegn betyr at Redis ikke feiler hvis ikke tilgj.) |
| 172.17.0.1 | Docker bridge network gateway (standard IP for docker0 interface)       |

**Hvorfor trenger vi 172.17.0.1?**

Photon kjører i en Docker-container, og containeren må kunne koble til Redis som kjører på host-maskinen (King). Docker-containere kobler til host via Docker bridge network, som bruker `172.17.0.1` som gateway-adresse. Uten denne adressen ville Photon-containeren ikke kunne nå Redis.

#### Beskyttelsesmodus (protected-mode)

```conf
# [borgar] Needed for docker container to be able to connect
protected-mode no
```

**Hva er protected mode?**

Protected mode er en sikkerhetsfunksjon i Redis som blokkerer alle eksterne tilkoblinger når:

- Ingen passord er satt
- Redis lytter på andre adresser enn localhost

**Hvorfor må vi skru av protected mode?**

Siden vi har lagt til `172.17.0.1` (som ikke er localhost) i `bind`-konfigurasjonen, vil Redis blokkere tilkoblinger fra Docker-containeren hvis protected mode er på. Ved å skru av protected mode tillater vi Docker-containeren å koble til Redis.

{% callout title="Er dette trygt?" type="note" %}
Ja, dette er trygt i vårt tilfelle. `172.17.0.1` er en intern Docker network IP som kun er tilgjengelig på host-maskinen (King). Ingen eksterne maskiner har tilgang til dette nettverket, så det er ingen sikkerhetsrisiko.
{% /callout %}

## Cronjobs

King har følgende automatiske oppgaver som kjører regelmessig:

| Tidspunkt    | Kommando                                  | Formål                                                     |
| ------------ | ----------------------------------------- | ---------------------------------------------------------- |
| 04:27 daglig | `acme.sh --cron`                          | Fornyer TLS-sertifikater automatisk                        |
| 03:00 daglig | `/usr/bin/docker system prune -fa`        | Rydder opp ubrukte Docker-ressurser                        |
| 02:00 daglig | `/usr/bin/chmod og-rwx -R /root/.acme.sh` | Sikrer at acme.sh-mapper har riktige (strenge) tillatelser |

## Verktøy og scripts

### get-env.sh

Et hjelpescript som ligger i `/root/` for å hente miljøvariabler fra Vaultwarden (Royal).

**Bruk:**

```bash
./get-env.sh <master-password> <item-id> <destination-path>
```

Scriptet synkroniserer med Vaultwarden, henter et spesifikt item basert på ID, og lagrer notater-feltet til en fil. Dette brukes under deployment for å hente sensitive miljøvariabler.

{% callout title="Vaultwarden" type="note" %}
Les mer om Vaultwarden på **Royal** sin dokumentasjonsside.
{% /callout %}

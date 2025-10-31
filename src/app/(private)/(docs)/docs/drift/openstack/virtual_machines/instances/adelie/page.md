_sist oppdatert: 2025-10-30 av Borgar_

# Adelie

## Oversikt

Adelie er en VM-instans på OpenStack som brukes i all hovedsak for hosting av alle TIHLDEs småtjenester og nettsider, som for eksempel Codex, Blitzed, Utlegg, Sporty, med flere. Disse tjeneste hosted i Docker containere.

## Systemdetaljer

| Egenskap       | Verdi              |
| -------------- | ------------------ |
| VM-navn        | Adelie             |
| IPv4-adresse   | 192.168.0.41       |
| Operativsystem | Debian 13 (trixie) |

## SSH-konfigurasjon

### Automatisk root-bytte

Når du SSH-er inn på Adelie blir du automatisk switchet fra **debian**-brukeren til **root**-brukeren.

Dette skjer ved at **debian** sitt `.bash_profile`-script (`/home/debian/.bash_profile`) blir automatisk kjørt når du logger inn som **debian**:

```bash
# Auto-switch to root on SSH login
if [[ $- == *i* ]] && [[ $(id -u) -ne 0 ]]; then # If shell is interactive:
    exec sudo -i # Switch to root
fi
```

{% callout title="Root-tilgang" type="warning" %}
Du får automatisk root-tilgang ved innlogging. Vær ekstra forsiktig med kommandoer du kjører, spesielt kommandoer som påvirker flere filer eller tjenester.
{% /callout %}

## Nettverkskonfigurasjon

Adelie mottar all innkommende trafikk fra proxy-instansen **Chinstrap**. VM-en bruker **Nginx** for å route denne trafikken videre til riktig tjeneste.

{% callout title="Les mer om nettverket" type="note" %}
Se dokumentasjonen for "Nettverking" for å lese mer om hvordan Nginx og nettverkingen fungerer.
{% /callout %}

## TLS-sertifikater

Adelie bruker **acme.sh** for å håndtere TLS-sertifikater for domenene. Sertifikatene fornyes automatisk gjennom Domeneshop sitt API.

### Aktive sertifikater

```bash
acme.sh --list
```

| Domene     | Nøkkellengde | SAN-domener   | CA              | Opprettet  | Fornyes    |
| ---------- | ------------ | ------------- | --------------- | ---------- | ---------- |
| tihlde.org | ec-256       | \*.tihlde.org | LetsEncrypt.org | 2025-10-22 | 2025-12-20 |

Sertifikatene ligger i `/root/.acme.sh/` og har begrensede tillatelser for sikkerhet.

## Nettsider og tjenester

### Prosjektstruktur

Alle prosjektfiler for nettsider og tjenester ligger i `/root/<prosjekt-navn>`. Hver prosjektmappe inneholder typisk:

- Prosjektets kildefiler
- Docker-konfigurasjon
- `deploy.sh` - deployment-script

### Deployment-prosess

De fleste tjenester deployes automatisk via GitHub workflows som:

1. SSH-er seg inn på Adelie
2. Navigerer til riktig prosjektmappe
3. Kjører `deploy.sh`-scriptet
4. Tar ned eksisterende Docker-container
5. Bygger og starter en ny, oppdatert container

{% callout title="Deployment" type="note" %}
Deployment-prosessen håndteres automatisk av GitHub workflows. Deploy-scriptet tar seg av å stoppe gamle containere og starte nye.
{% /callout %}

## Cronjobs

Adelie har følgende automatiske oppgaver som kjører regelmessig:

| Tidspunkt    | Kommando                                                                            | Formål                                                              |
| ------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 03:00 daglig | `0 3 * * * /usr/bin/sh -c '/usr/bin/date && /usr/bin/docker image prune -af && ...` | Rydder opp ubrukte Docker-ressurser (unntatt containere og volumer) |
| 02:00 daglig | `/usr/bin/chmod og-rwx -R /root/.acme.sh`                                           | Sikrer at acme.sh-mapper har riktige (strenge) tillatelser          |
| 10:56 daglig | `acme.sh --cron`                                                                    | Fornyer TLS-sertifikater automatisk                                 |

## Verktøy og scripts

### get-env.sh

Et hjelpescript som ligger i `/root/` for å hente miljøvariabler fra Vaultwarden:

```bash
#!/usr/bin/env bash

set -euo pipefail

export MASTER_PASSWORD=$1
export ITEM_ID=$2
export DESTINATION_PATH=$3

if [ -z "$MASTER_PASSWORD" ] || [ -z "$ITEM_ID" ] || [ -z "$DESTINATION_PATH" ]; then
  exit 1
fi

bw sync

echo "$MASTER_PASSWORD" | bw get item "$ITEM_ID" | jq -r '.notes' > "$DESTINATION_PATH"
```

**Bruk:**

```bash
./get-env.sh <master-password> <item-id> <destination-path>
```

Scriptet synkroniserer med **Vaultwarden**, henter et spesifikt item basert på ID, og lagrer notater-feltet til en fil spesifisert av `<destination-path>` (vanligvis `/root/<prosjekt>/.env`).
Du kan lese mer om **Vaultwarden** på **Royal** sin dokumentasjonsside.

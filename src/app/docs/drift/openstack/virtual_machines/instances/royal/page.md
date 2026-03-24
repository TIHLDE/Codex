_sist oppdatert: 2025-10-30 av Borgar_

# Royal

## Oversikt

**Royal** er en VM-instans på OpenStack som brukes til å hoste **Vaultwarden**, en open-source, Bitwarden-kompatibel password/secret manager. Vaultwarden brukes til å lagre sensitiv data som miljøvariabler til prosjekter, passord og SSH-nøkler.

## Systemdetaljer

| Egenskap       | Verdi        |
| -------------- | ------------ |
| VM-navn        | Royal        |
| IPv4-adresse   | 192.168.0.34 |
| Operativsystem | Debian       |

## Nettverkskonfigurasjon

Royal mottar all innkommende trafikk fra proxy-instansen **Chinstrap**. Når Chinstrap mottar en forespørsel for `vault.tihlde.org`, vil den rute denne forespørselen til Royal på port 3000, hvor Docker-containeren for Vaultwarden håndterer den.

### Tilgangskontroll

{% callout title="Nettverkstilgang påkrevd" type="warning" %}
Man må være koblet til enten _eduroam_ eller _NTNU sin VPN_ for å få tilgang til Vaultwarden på vault.tihlde.org. Denne tilgangskontrollen håndteres av Chinstrap sin Nginx-konfigurasjon for vault.tihlde.org.
{% /callout %}

{% callout title="Les mer om nettverket" type="note" %}
Se dokumentasjonen for "Nettverking" for å lese mer om hvordan Nginx og nettverkingen fungerer, inkludert tilgangsbegrensninger.
{% /callout %}

## Vaultwarden

### Docker-konfigurasjon

Vaultwarden kjører i en Docker-container og er eksponert på port 3000 og bundet til sin lokale IP-adresse på 192.168.0.0/24 subnettet slik at den kan bli nådd fra Chinstrap:

```bash
docker ps
```

| Container ID | Image                     | Status               | Ports                     | Navn        |
| ------------ | ------------------------- | -------------------- | ------------------------- | ----------- |
| 710c791793ad | vaultwarden/server:latest | Up 4 weeks (healthy) | 192.168.0.34:3000->80/tcp | vaultwarden |

### Data-lagring

{% callout title="Kritisk data!" type="warning" %}
Vaultwarden sin data ligger i `/vaultwarden_data/`. Denne mappen inneholder alle passord, hemmeligheter og sensitiv data for hele organisasjonen. Man må være _EKSTREMT_ forsiktig med denne mappen - ikke slett, flytt eller endre noe her med mindre du vet nøyaktig hva du gjør.
{% /callout %}

### Oppdatering

Vaultwarden kan oppdateres trygt ved å kjøre:

```bash
./update-vaultwarden.sh
```

Dette scriptet håndterer hele oppdateringsprosessen automatisk og ser noe slik ut:

```bash
#!/usr/bin/bash

echo "Deleting old container..."
sudo docker rm -f vaultwarden 2> /dev/null

echo "Deleting old Vaultwarden docker image..."
sudo docker image rm vaultwarden/server:latest 2> /dev/null

echo "Fetching new image..."
sudo docker pull vaultwarden/server:latest

echo "Running new docker container..."
sudo docker run --detach \
  --name vaultwarden \
  --env DOMAIN="https://vault.tihlde.org" \
  --volume /vaultwarden_data/:/data/ \
  --restart unless-stopped \
  --publish 192.168.0.34:3000:80 \
  --env ADMIN_TOKEN=waOaGuhJY8fn \
  vaultwarden/server:latest

echo
echo "DONE!"
echo
```

**Hva scriptet gjør:**

1. Stopper og fjerner eksisterende Vaultwarden-container
2. Fjerner gammelt Docker-image
3. Laster ned nyeste versjon av Vaultwarden
4. Starter en ny container med oppdatert image

{% callout title="Trygg oppdatering" type="note" %}
Data-mappen (`/vaultwarden_data/`) blir montert inn i den nye containeren, så ingen data går tapt ved oppdatering.
{% /callout %}

## Bruk av Vaultwarden

Vaultwarden brukes aktivt av andre VM-instanser og tjenester for å hente sensitiv konfigurasjon. For eksempel bruker Adelie `get-env.sh`-scriptet (med Bitwarden CLI) for å hente miljøvariabler fra Vaultwarden under deployment.

Tilgang til Vaultwarden er tilgjengelig via nettleseren på **https://vault.tihlde.org** (husk at du må være på **eduroam** eller **NTNU VPN**).

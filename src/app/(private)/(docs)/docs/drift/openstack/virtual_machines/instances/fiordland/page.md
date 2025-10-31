_sist oppdatert: 2025-10-30 av Borgar_

# Fiordland

## Oversikt

Fiordland er en VM-instans på OpenStack som brukes til å hoste TIHLDEs database-systemer. Dette inkluderer både **PostgreSQL** og **MySQL (MariaDB)** som brukes av våre forskjellige tjenester og applikasjoner.

## Systemdetaljer

| Egenskap       | Verdi              |
| -------------- | ------------------ |
| VM-navn        | Fiordland          |
| IPv4-adresse   | 192.168.0.140      |
| Operativsystem | Debian 13 (trixie) |

## SSH-konfigurasjon

### Automatisk root-bytte

Når du SSH-er inn på Fiordland blir du automatisk switchet fra **debian**-brukeren til **root**-brukeren, på samme måte som på de andre VM-ene.

{% callout title="Root-tilgang" type="warning" %}
Du får automatisk root-tilgang ved innlogging. Vær ekstra forsiktig med kommandoer du kjører, spesielt siden Fiordland inneholder alle databasene våre. Feil her kan påvirke alle tjenester som er avhengige av databasen.
{% /callout %}

## Database-tjenester

Fiordland kjører følgende database-systemer:

### PostgreSQL

PostgreSQL er hovedatabase-systemet som brukes av de fleste av TIHLDEs tjenester, inkludert backend-applikasjonen (Photon).

### MySQL (MariaDB)

MariaDB (en open-source variant av MySQL) kjører også på Fiordland for tjenester som krever MySQL-kompatibel database, som TIHLDEs gamle backend, Lepton.

{% callout title="Kritisk infrastruktur" type="warning" %}
Fiordland er kritisk infrastruktur for TIHLDE. Nesten alle tjenestene våre er avhengige av databasene som kjører her. Vær ekstra forsiktig med endringer og sørg alltid for at du har backup før du gjør noe.
{% /callout %}

## Mer informasjon

For detaljert informasjon om database-oppsettet, inkludert:

- Konfigurasjon av PostgreSQL og MariaDB
- Backup-rutiner
- Tilgangsstyring og brukere
- Oppkobling fra andre VM-er

{% callout title="Les mer om databasene" type="note" %}
Se dokumentasjonen for _"[Drifts database oppsett](/docs/drift/databaser/databaser-i-drift)"_ for mer utfyllende informasjon om hvordan database-systemene er konfigurert og hvordan de brukes.
{% /callout %}

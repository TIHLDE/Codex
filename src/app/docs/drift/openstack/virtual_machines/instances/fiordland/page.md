# Fiordland

## Oversikt

Fiordland er en VM-instans på OpenStack som brukes til å hoste TIHLDEs database-system, **PostgreSQL**, som brukes av våre forskjellige tjenester og applikasjoner.

## Systemdetaljer

| Egenskap       | Verdi         |
| -------------- | ------------- |
| VM-navn        | Fiordland     |
| IPv4-adresse   | 192.168.0.140 |
| Operativsystem | Debian        |

{% callout title="Kritisk infrastruktur" type="warning" %}
Fiordland er kritisk infrastruktur for TIHLDE. Nesten alle tjenestene våre er avhengige av databasene som kjører her. Vær ekstra forsiktig med endringer og sørg alltid for at du har backup før du gjør noe.
{% /callout %}

## Mer informasjon

For detaljert informasjon om database-oppsettet, inkludert:

- Konfigurasjon av PostgreSQL
- Backup-rutiner
- Tilgangsstyring og brukere
- Oppkobling fra andre VM-er
- Bruk av databasesystemet

Se [Drifts database oppsett](/docs/drift/databaser/databaser-i-drift).

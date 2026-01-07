_sist oppdatert: 2025-10-30 av Borgar_

# Drifts database-oppsett

## Oversikt

Drift kjører sine databaser på **Fiordland**-instansen på OpenStack. Denne VM-en hoster både **PostgreSQL** og **MariaDB (MySQL)** som brukes av TIHLDEs forskjellige tjenester.

{% callout title="Kritisk infrastruktur" type="warning" %}
Databasene på Fiordland er kritisk infrastruktur. Nesten alle TIHLDEs tjenester er avhengige av disse databasene. Vær ekstra forsiktig med endringer og test alltid grundig før du gjør endringer i produksjon.
{% /callout %}

## PostgreSQL

PostgreSQL er installert med standard konfigurasjon, bortsett fra små, men viktige endringer i to konfigurasjonsfiler.

### Tilgangskontroll (pg_hba.conf)

PostgreSQL sin tilgangskontroll er konfigurert i `/etc/postgresql/17/main/pg_hba.conf`:

```conf
# TYPE  DATABASE        USER            ADDRESS             METHOD
local   all             all                                 trust
host    all             postgres        0.0.0.0/0           reject
host    all             all             192.168.0.36        scram-sha-256
```

Dette er et sett med regler for hvordan autentisering fra forskjellige tilkoblinger skal fungere. **Første regel (rad) som matcher er den som brukes**, så rekkefølgen er betydelig.

#### Forklaring av kolonner

| Kolonne  | Betydning                                                                                                                  |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| TYPE     | Type tilkobling. `local` = lokal tilkobling fra VM-en selv, `host` = ekstern TCP/IP tilkobling                             |
| DATABASE | Hvilken database regelen gjelder for. `all` = alle databaser                                                               |
| USER     | Hvilke brukere regelen gjelder for. `all` = alle brukere, `postgres` = kun superuser                                       |
| ADDRESS  | Adressen til tilkoblingskilden. `0.0.0.0/0` = alle adresser, `192.168.0.36` = spesifikk IP                                 |
| METHOD   | Autentiseringsmetode. `trust` = ingen passord, `reject` = avvis tilkobling, `scram-sha-256` = krev passord (kryptert hash) |

#### Forklaring av reglene

1. **Lokal tilgang uten passord:** Alle lokale tilkoblinger fra VM-en selv får tilgang uten passord
2. **Blokkering av postgres-bruker:** Postgres superuser kan ikke koble til eksternt (sikkerhet)
3. **Tilgang fra Chinstrap:** Alle brukere fra IP `192.168.0.36` (Chinstrap proxy) kan koble til med passord

{% callout title="Hvorfor blokkere postgres-bruker?" type="note" %}
Postgres-brukeren er superuser og har full tilgang til alt. Ved å blokkere ekstern tilgang for denne brukeren reduserer vi risikoen for at noen får full kontroll over databasen hvis et passord skulle lekke.
{% /callout %}

### Nettverkskonfigurasjon (postgresql.conf)

PostgreSQL sin nettverkskonfigurasjon er konfigurert i `/etc/postgresql/17/main/postgresql.conf`:

```conf
#listen_addresses = 'localhost'  # Standard verdi (kommentert ut)
listen_addresses = '*'            # Vår konfigurasjon
```

Her spesifiserer vi på hvilke adresser PostgreSQL skal lytte på for innkommende tilkoblinger.

- **Standard:** PostgreSQL lytter kun på `localhost` (kun lokale tilkoblinger)
- **Vår konfigurasjon:** `*` betyr at PostgreSQL lytter på alle nettverksgrensesnitt

{% callout title="Hvorfor lytte på alle adresser?" type="note" %}
PostgreSQL støtter dessverre ikke CIDR-notasjon for å spesifisere flere adresser i `listen_addresses`. Derfor bruker vi `*` for å lytte på alle adresser, og bruker heller `pg_hba.conf` for å kontrollere hvilke adresser som faktisk får tilgang.
{% /callout %}

## MariaDB (MySQL)

MariaDB kjører også på Fiordland og brukes av tjenester som krever MySQL-kompatibel database, som TIHLDEs gamle backend Lepton.

{% callout title="Dokumentasjon mangler" type="warning" %}
Detaljert konfigurasjon for MariaDB er ikke dokumentert ennå. Hvis du jobber med MariaDB-oppsettet, vennligst oppdater denne dokumentasjonen.
{% /callout %}

## Backup

Drift tar daglige backups av alle PostgreSQL databasene for å sikre at vi kan gjenopprette data ved katastrofe.

### Backup-konfigurasjon

| Egenskap          | Verdi                                       |
| ----------------- | ------------------------------------------- |
| Script            | `/root/backup/backup-databases.py` (Python) |
| Tidspunkt         | Kl. 02:00 hver natt (cron-jobb)             |
| Loggfil           | `/root/backup/logs/<timestamp>.log`         |
| Lagringssted      | TIHLDE sin Azure Blob Storage               |
| Komprimering      | tar/gzip                                    |
| Varsling ved feil | E-post til driftsminister@tihlde.org        |

### Hvordan backupen fungerer

1. **Triggering:** En cron-jobb kjører backup-scriptet hver natt kl. 02:00
2. **Dumping:** Scriptet dumper alle databaser fra både PostgreSQL og MariaDB
3. **Komprimering:** Dumpene komprimeres med tar/gzip for å spare plass
4. **Opplasting:** De komprimerte backup-filene lastes opp til Azure Blob Storage
5. **Feilhåndtering:** Hvis noe går galt sendes det automatisk e-post til driftsminister@tihlde.org

### Administrere backup

**Se/endre cron-jobben:**

```bash
crontab -e
```

**Se backup-logger:**

```bash
cat /root/backup/logs/<timestamp>.log
```

{% callout title="Feilhåndtering" type="note" %}
Backup-scriptet er wrappet i try-except (Pythons versjon av try-catch), så hvis det skjer en feil under backupen vil en e-post automatisk bli sendt til driftsminister@tihlde.org. Sjekk e-posten regelmessig for å sikre at backupene fungerer som de skal.
{% /callout %}

## Tilkobling til databasene

Dersom du har SSH-tilgang på Fiordland kan du koble på med:

```bash
root@fiordland:~# psql -U <database-navn>
```

Dersom du skal koble på uten SSH-tilgang må du bruke følgende URL:

`postgresql://<database>:<passord>@drift.tihlde.org:5432/<database>`

{% callout title="Tilkobling fra egen PC" type="warning" %}
Av sikkerhetshensyn må du være koblet til **eduroam** eller **NTNU VPN** for å koble til databasene fra din egen PC.
{% /callout %}

{% callout title="I produksjonsmiljø" type="warning" %}
Når du skal bruke denne URL-en i et produksjonsmiljø på en OpenStack instans kan du (burde du) bytte ut
**drift.tihlde.org** med **fiordland**. OpenStack vil da automagisk rute trafikken internt til riktig VM.
{% /callout %}

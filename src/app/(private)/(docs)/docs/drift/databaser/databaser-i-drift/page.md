---
tittel: "Databasene til Drift"
---

_oppdatert 05.09.2025_

# Hvor er databasene?

Drift kjører sine databaser på *fiordland*-instansen på OpenStack. Da dette ble skrevet kjører
PostgreSQL og MariaDB (MySQL) på denne instansen.

# Hvordan er de konfigurert?
## PostgreSQL
PostgreSQL er installert med default konfigurasjon, bortsett fra små endringer i to filer.
### /etc/postgresql/17/main/pg_hba.conf
```
# TYPE  DATABASE        USER            ADDRESS             METHOD
local   all             all                                 trust
host    all             postgres        0.0.0.0/0           reject
host    all             all             192.168.0.36		scram-sha-256
```

Dette er et sett med regler for hvordan autentisering fra forskjellige tilkoblinger skal fungere for PostgreSQL databaser.
Første regel (rad) som inntreffer er den som brukes. Rekkefølgen er derfor betydelig.

- Type: Type tilkobling. `local` betyr at det er en lokal tilkobling fra vm-instansen, `host` betyr at det er en ekstern TCP/IP tilkobling.
- Database: Hvilken database regelen gjelder for. `all` betyr at regelen gjelder for alle databaser.
- User: Brukere regelen gjelder for. `all` betyr at regelen gjelder for alle brukere. `postgres` betyr da at regelen gjelder bare for database-brukeren postgres.
- Address: Adressen til tilkoblingskilden. `0.0.0.0/0` betyr at regelen gjelder for alle adresser.
- Method: Autentiseringsmetoden som skal brukes. `trust` betyr at det ikke er noe passord
som kreves for å koble til databasen. `reject` betyr at tilkoblingen blir avvist. `scram-sha-256` betyr at det kreves passord for å koble til databasen.

### /etc/postgresql/17/main/postgresql.conf
```
#listen_addresses = 'localhost' # Standard verdi
listen_addresses = '*'
```
Her spesifiserer vi på hvilke addresser postgresql skal lytte på. Desverre er det ikke mulig å bruke CIDR-notasjon for å spesifisere flere adresser, så det er bare mulig å spesifisere et spekter av IP-adresser.
Derfor bruker vi `*` for å spesifisere at den skal lytte på alle adresser. Og bruker heller `pg_hba.conf` for å spesifisere hvilke adresser som skal ha tilgang til databasen.

## Backups

Drift tar daglige backups av alle databasene. Her er noen viktige punkter:

- Backup-scriptet er skrevet i Python og ligger i `/root/backup/backup-databases.py`. Loggene fra alle backups som blir tatt ligger i `/root/backup/logs/backup-databases.log`.
- Vi tar backup av databasene hver natt kl 02:00. Triggering mekanismen er en cron-jobb som kan endres eller leses ved å kjøre `crontab -e`.
- Logs fra alle backups ligger i `/root/backup/logs/`.
- Backupene blir først komprimert med tar/gzip og sendt til TIHLDE sin Azure Blob Storage.
- Hele backup scriptet er wrappet i try-catch (try-except fordi Python er ***different***) så hvis det skjer en feil under backupen vil en epost bli sendt til driftsminister@tihlde.org.

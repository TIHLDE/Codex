---
tittel: Hvordan lage en database
---

_oppdatert 05.09.2025_

# Hvordan lage en database for et prosjekt

## Div. info

- Å skrote rundt med databaser er svært risikabelt så her skal man helst være to stykker så man forsikrer seg at ingen uskyldige databaser går tapt.
- Alle databasene som driftes av Drift (pun intended) ligger på "fiordland"-instansen på OpenStack.
- Av sikkerhetsgrunner kan man bare koble til databaser fra NTNU sitt nettverk for å slippe at angripere fra Russland og lignende steder kan koble seg på. Trenger du tilgang til databasen utenfor NTNU sitt nett så må du bruke NTNU sin VPN.

## Det du trenger

- Du trenger SSH-tilgang til _fiordland_-instansen. Har du ikke det så kan du spørre folk i Drift til du finner noen som har det.
- Du skal også helst ha en makker å kjøre kommandoene med fordi database-greier er risikabelt arbeid.

## Lag databasen automagisk (anbefalt)

Drift har laget et shell-script som lager databasen for deg. For å bruke dette scriptet SSH-er du deg inn på database serveren og kjører

```bash
./create-psql-database.sh <database-navn>   # For PostgreSQL databaser
./create-mysql-database.sh <database-navn>  # For MySQL databaser
```

hvor `<database-navn>` er navnet på databasen du skal lage. Databasen vil da bli laget automagisk og du vil da få ut credentials som du må ta vare på og ikke miste(!!!).

{% callout title="Tilkobling fra egen PC" type="warning" %}
Hvis du skal koble deg til databasen fra PC-en din så må du bytte ut `fiordland` med `drift.tihlde.org` i URL-en du får ut av scriptet.
Av sikkerhetsgrunner må du også være koblet på eduroam eller NTNU sin VPN.
{% /callout %}

## Lag databasen manuelt

### PostgreSQL

1. SSH inn i _fiordland_
2. Kjør `pwgen -n -c 24 1` og noter ned utskriften (dette blir passordet for databasen).
3. Kjør `psql -U postgres`. Du vil da være koblet på PostgreSQL CLI-et som admin brukeren `postgres` så her må du være YPPERST forsiktig (det ryktes 100 bøter per database du sletter med et uhell). Du burde nå se noe som dette:

```placeholder
root@fiordland:~# psql -U postgres
psql (17.5 (Debian 17.5-1))
Type "help" for help.

postgres=# 
```

4. Kjør følgende tre SQL-queries hvor `<name>` er navnet på det du trenger en database til, f.eks. _blitzed_, _kontres_, _tihlder_ etc., og `<password>` er passordet du genererte og noterte ned tidligere. Husk å avslutte hver query med `;`:

```sql
-- Lager en PostgreSQL bruker med navn `<name>` og passord `<password>`.
CREATE USER <name> WITH PASSWORD '<password>';

-- Gir brukeren lov til å lage databaser (denne trengs f.eks. dersom prosjektet bruker prisma)
ALTER USER <name> CREATEDB;

-- Lager en database med navn `<name>` og setter eieren til den nye brukeren.
CREATE DATABASE <name> WITH OWNER <name>;

-- Fjerner CONNECT tilgang på databasen for alle andre brukere enn den nye brukeren.
REVOKE CONNECT ON DATABASE <name> FROM public;
```

Til slutt skriver du `\q` (uten semikolon og quotes) for å gå ut av PostgreSQL CLI-et.

_Editor's note: skulle gjerne brukt transactions, men PostgreSQL lar oss ikke bruke `CREATE DATABASE` i transaction blocks :(_

Da er du ferdig! Du kan nå koble deg til databasen med følgende informasjon/env-variabler (som du ikke må miste!!):

```env
DATABASE_URL="postgresql://<name>:<password>@fiordland:5432/<name>"

DB_HOST=fiordland
DB_PORT=5432
DB_USER=<navn>
DB_NAME=<navn>
DB_PASSWORD=<password>
```

{% callout title="Tilkobling fra egen PC" type="warning" %}
Hvis du skal koble deg til database fra PC-en din så må du bytte ut `fiordland` med `drift.tihlde.org`.
Husk også at du må være koblet på eduroam eller NTNU sin VPN.
{% /callout %}

### MySQL

1. SSH inn i _fiordland_
2. Kjør `pwgen -n -c 24 1` og noter ned utskriften (dette blir passordet for databasen).
3. Kjør kommandoen `mysql`. Du vil da være koblet på MySQL CLI-et som admin-bruker så her må du være YPPERST forsiktig (det ryktes 100 bøter per database du sletter med et uhell). Du burde nå se noe som dette:

```placeholder
root@fiordland:~# mysql
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 1028
Server version: 11.8.2-MariaDB-1 from Debian -- Please help get to 10k stars at https://github.com/MariaDB/Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> 
```

4. Kjør følgende SQL-queries hvor `<name>` er navnet på det du trenger en database til, f.eks. _blitzed_, _kontres_, _tihlder_ etc., og `<password>` er passordet du genererte og noterte ned tidligere. Husk å avslutte hver query med `;` og få med alle hermetegn:

```sql
-- Lag databasen
CREATE DATABASE `<name>`;

-- Lag tilhørende bruker
CREATE USER '<name>'@'%' IDENTIFIED BY '<password>';

-- Gi alle rettigheter til den korresponderende brukeren på databasen
GRANT ALL PRIVILEGES ON `<name>`.* TO '<name>'@'%';

-- Gjøre endringer gjeldende
FLUSH PRIVILEGES;
```

Til slutt skriver du `exit` (uten semikolon og quotes) for å gå ut av MySQL CLI-et.

Da er du ferdig! Du kan nå koble deg til databasen med følgende informasjon/env-variabler (som du ikke må miste!!):

```env
DATABASE_URL="mysql://<name>:<password>@fiordland:3306/<name>"

DB_HOST=fiordland
DB_PORT=5432
DB_USER=<navn>
DB_NAME=<navn>
DB_PASSWORD=<password>
```

{% callout title="Tilkobling fra egen PC" type="warning" %}
Hvis du skal koble deg til databasen fra PC-en din så må du bytte ut `fiordland` med `drift.tihlde.org`.
Av sikkerhetsgrunner må du også være koblet på eduroam eller NTNU sin VPN.
{% /callout %}

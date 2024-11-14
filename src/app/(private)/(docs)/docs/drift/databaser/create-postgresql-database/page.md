---
tittel: Hvordan lage en PostgreSQL database for et prosjekt
---

_skrevet 07.11.2024_

# Hvordan lage en PostgreSQL database for et prosjekt

## Div. info

- Å skrote rundt med databaser er svært risikabelt så her skal man helst være to stykker så man forsikrer seg at ingen uskyldige databaser går tapt.
- Alle databasene som driftes av Drift (pun intended) ligger på "_database-server_"-instansen på OpenStack.
- Av sikkerhetsgrunner kan man bare koble til databaser fra NTNU sitt nettverk for å slippe at angripere fra Russland og lignende steder kan koble seg på. Trenger du tilgang til databasen utenfor NTNU sitt nett så må du bruke NTNU sin VPN.

## Det du trenger

Du trenger bare SSH-tilgang til _database-server_-instansen. Har du ikke det så kan du spørre folk i Drift til du finner noen som har det. Du skal også helst ha en kompis å kjøre kommandoene med fordi database-greier er risikabelt arbeid.

## Lag databasen automagisk (anbefalt)

Drift har laget et shell-script som lager databasen for deg. For å bruke dette scriptet SSH-er du deg inn på database serveren og kjører

```bash
create-postgresql-database <database-navn>
```

hvor `<database-navn>` er navnet på databasen du skal lage. Databasen vil da bli laget automagisk og du vil da få ut credentials som du må ta vare på og ikke miste(!!!).

{% callout title="HUSK" type="warning" %}
Du kan bare koble til databasen fra NTNU sitt interne nettverk. Bruk NTNU sin VPN for å få tilgang på databasen fra utsiden av NTNU sitt nettverk.
{% /callout %}

## Lag databasen manuelt

1. SSH inn i _database-server_
2. Kjør `pwgen -n -c 24 1` og noter ned utskriften (dette blir passordet for databasen).
3. Kjør `psql -U postgres`. Du vil da være koblet på PostgreSQL CLI-et som admin brukeren `postgres` så her må du være YPPERST forsiktig (det ryktes 100 bøter per database du sletter med et uhell). Du burde nå se noe som dette:

```placeholder
debian@database-server:~$ psql -U postgres
psql (15.8 (Debian 15.8-0+deb12u1))
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
DATABASE_URL="postgresql://<name>:<password>@<ip-address>:5432/<name>"

DB_HOST=<ip-address>
DB_PORT=5432
DB_USER=<navn>
DB_NAME=<navn>
DB_PASSWORD=<password>
```

hvor `<ip-address>` er IP-adressen til _database-server_ (den 7. november 2024 så var IP-adressen `10.212.25.14`).

{% callout title="HUSK" type="warning" %}
Du kan bare koble til databasen fra NTNU sitt interne nettverk. Bruk NTNU sin VPN for å få tilgang på databasen fra utsiden av NTNU sitt nettverk.
{% /callout %}

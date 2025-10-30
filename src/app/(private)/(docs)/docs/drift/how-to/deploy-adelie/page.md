---
title: Deploy Nettside på Adelie
---

Dokumentet viser hvordan man setter opp og deployer nettsider på Adelie.

## 1. Opprett database

Dersom prosjektet trenger en database må du følge denne guiden først:
[Guide: Opprett database](https://codex.tihlde.org/docs/drift/databaser/create-database).

## 2. Klargjør prosjektet

- **Docker:** Sørg for at det eksisterer en fungerende `Dockerfile` i prosjektet.
- **Deploy-script:** Valider at `deploy.sh`-scriptet eksisterer og er korrekt. Her må du bytte ut `PORT`-variabelen med en som ikke brukes av noen andre docker containere eller tjenester. Husk og også legge til eventuelle kommandoer for database-migreringer, typ. `prisma migrate deploy` etc.

### Sjekk GitHub workflow

Vi bruker GitHub Actions for automatisk deployment av nettsider når det kommer nye commits.

Bekreft at det finnes en GitHub workflow for deployment i repoet. Den skal ligge i `.github/workflows` i repoet.

Dersom det ikke finnes en workflow, kan du kopiere fra et annet repo, gjerne et repo med lignende tech-stack.
Hvis du kopierer fra et annet repo, husk å les gjennom å se at det passer for ditt prosjekt.

## 3. Klon prosjektet til server

SSH inn på Adelie-serveren og klon repoet:

```bash
[drifter@syktbrapc ~]$ ssh adelie
root@adelie:~# git clone https://github.com/TIHLDE/<prosjekt>.git /root/<prosjekt>
```

## 4. Hent Vaultwarden Item ID

Dersom prosjektet ikke bruker env variabler kan du hoppe over dette steget.

Under automatisk deployment må vi hente ut environment-variablene til prosjektet fra Vaultwarden.
For å få til dette må vi vite ID-en til environment-variablene for vårt prosjekt i Vaultwarden slik at vi vet hvilke som skal hentes.

1. Få noen med tilgang til Vaultwarden til å gå til [Vaultwarden](https://vault.tihlde.org).
2. Trykk på prosjektet i listen over collections. Dersom det ikke finnes kan du lage en ny collection for prosjektet og legge in env-variablene.
3. Trykk inn på environment-variablene til prosjektet og se i URL-en i nettleseren. Item ID-en er den lange strengen med tall etter `itemId`, f.eks
   https://vault.tihlde.org/#/vault?itemId=**aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee**&action=view
4. Kopier denne ID-en, eller memoriser den som en ekte Drift'er.

## 5. Legg til secrets i GitHub

Deploy-workflowen trenger to secrets/variabler for å fungere, for disse varierer fra prosjekt til prosjekt.

Gå til repoet på GitHub:

**Settings → Secrets and variables → Actions → Secrets → New repository secret**  
Legg til følgende secret:

- `VAULTWARDEN_ITEM_ID`: ID-en du hentet fra Vaultwarden i forrige steg.

**Settings → Secrets and variables → Actions → Variables → New repository variable**  
Legg til følgende variabel:

- `WORKING_DIRECTORY`: Mappen der prosjektet ligger på Adelie (der du klonet det), mest sannsynlig `/root/<prosjekt-navn>`.

{% callout title="Overskrive organization variabler/secrets" type="warning" %}
Nederst på siden ser du en liten liste over variabler/secrets som er arvet fra TIHLDE organisation.
Dersom det trengs kan du overskrive disse ved å legge til en variabel/secret med samme navn som den i organization.
{% /callout %}

## 6. Nginx-konfigurasjon

På Adelie-serveren:

1. Gå til nginx-konfigurasjonene på Adelie:

   ```bash
   cd /etc/nginx/sites-available
   ```

2. Kopier template og opprett ny config for prosjektet som skal hostes:

   ```bash
   cp template.conf <prosjekt>.tihlde.org.conf
   ```

3. Rediger `<prosjekt>.tihlde.org.conf` med ønsket innhold (nano/nvim):

- Bytt ut alle forekomster av `<NAME>` med subdomene du vil bruke (uten angular brackets).
- Bytt ut alle forekomster av `<PORT>` med porten docker containeren skal kjøre på (uten angular brackets). Her må du skrive inn porten du satte i `deploy.sh`.

4. Opprett symlink til `sites-enabled`:

   ```bash
   ln -s ../sites-available/mittprosjekt.tihlde.org.conf ../sites-enabled/
   ```

{% callout title="Overskrive organization variabler/secrets" type="note" %}
Dette må gjøres siden Nginx bare bruker config filer i `sites-enabled` mappen, ikke `sites-available`.
Grunnen til at vi symlinker i stedet får å putte filen direkte i `sites-enabled` er fordi da kan man
enkelt skru av og på nettsiden ved å enkelt slette/lage symlinken i stedet for å flytte/slette hele konfigurasjonsfilen eller skru av og på hele docker containeren.
{% /callout %}

5. Test og reload nginx:

   ```bash
   nginx -t # Denne skal rapportere "test is successful"
   nginx -s reload
   ```

6. Husk å committe endringer:
   ```bash
   git add .
   git commit -m "[Navn Navnesen] Added <prosjekt> Config"
   ```

## 7. Deploy prosjektet

Gå til prosjektmappen og kjør deploy-scriptet:

```bash
cd ~/<prosjekt>
chmod u+x deploy.sh
./deploy.sh
```

## 8. DNS-oppsett

Finn noen med tilgang til TIHLDEs [Domeneshop](https://domene.shop), og legg til en **CNAME DNS record** for domenet som skal brukes med TTL fem minutter. Den skal peke mot `drift.tihlde.org`.

# Og da skal alt bare funke :) 🎉

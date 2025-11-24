_sist oppdatert: 2025-10-31 av Borgar_

# Deploy nettside på Adelie

Denne guiden viser steg-for-steg hvordan du setter opp og deployer en ny nettside eller tjeneste på **Adelie**.

## Oversikt

Prosessen for å deploye en ny nettside består av følgende steg:

1. Opprett database (hvis nødvendig)
2. Klargjør prosjektet (Docker + deploy-script)
3. Klon prosjektet til serveren
4. Hent Vaultwarden Item ID (hvis prosjektet bruker miljøvariabler)
5. Legg til secrets i GitHub
6. Sett opp Nginx-konfigurasjon
7. Deploy prosjektet
8. Sett opp DNS

## Forutsetninger

Før du starter må du ha:

- SSH-tilgang til Adelie
- Tilgang til GitHub-repoet for prosjektet
- Admin-tilgang til repoet på GitHub (for å legge til secrets)
- Tilgang til Vaultwarden (hvis prosjektet bruker miljøvariabler)
- Tilgang til Domeneshop (for DNS-oppsett, eller noen som kan hjelpe deg)

---

## 1. Opprett database

{% callout title="Kun hvis prosjektet trenger database" type="note" %}
Hvis prosjektet ikke trenger en database kan du hoppe over dette steget.
{% /callout %}

Dersom prosjektet trenger en database må du først opprette denne på Fiordland.

Følg guiden: [Opprett database](/docs/drift/databaser/create_database)

## 2. Klargjør prosjektet

Før du kan deploye må prosjektet ha følgende filer på plass:

### Dockerfile

Prosjektet må ha en fungerende `Dockerfile` som bygger prosjektet og kjører det i en container.

### Deploy-script

Prosjektet må ha et `deploy.sh`-script (med executable permissions) som håndterer deployment. Gjerne bruk scriptet til et prosjekt med lignende tech-stack. Dette scriptet skal:

- Stoppe eksisterende Docker-container
- Bygge ny Docker-image
- Starte ny container med riktig port og konfigurasjon
- Kjøre eventuelle database-migreringer (f.eks. `prisma migrate deploy`)

{% callout title="Velg ubrukt port" type="warning" %}
I `deploy.sh`-scriptet må du sette en `PORT`-variabel som ikke brukes av andre Docker-containere eller tjenester på Adelie. Hver tjeneste må ha sin egen unike port. Du kan sjekke hvilke porter som er i bruk ved å se i `/etc/nginx/sites-available/` eller kjøre `docker ps`.
{% /callout %}

### GitHub workflow

Vi bruker **GitHub Actions** for automatisk deployment når det kommer nye commits til hovedbranchen.

Bekreft at det finnes en GitHub workflow for deployment i repoet. Den skal ligge i `.github/workflows/` mappen.

**Hvis workflow mangler:**

1. Kopier workflow-filen fra et annet repo med lignende tech-stack.
2. Les gjennom workflow-filen og tilpass den for ditt prosjekt (f.eks. fjern linjen om `get-env.sh` dersom prosjektet ditt ikke bruker miljøvariabler). Du trenger mest sannsynlig ikke gjøre noen endringer.

## 3. Klon prosjektet til serveren

SSH inn på Adelie og klon repoet til `/root/<prosjekt-navn>`:

```bash
ssh adelie
```

```bash
git clone https://github.com/TIHLDE/<prosjekt>.git /root/<prosjekt>
```

{% callout title="Mappenavn" type="note" %}
Husk hvilket mappenavn du bruker (vanligvis prosjektnavnet), du trenger dette senere når du skal sette opp GitHub secrets.
{% /callout %}

## 4. Hent Vaultwarden Item ID

{% callout title="Kun hvis prosjektet bruker miljøvariabler" type="note" %}
Hvis prosjektet ikke bruker miljøvariabler kan du hoppe over dette steget.
{% /callout %}

Under automatisk deployment henter deploy-scriptet miljøvariabler fra Vaultwarden. For å få til dette må vi vite ID-en til environment-variablene i Vaultwarden.

**Slik henter du Item ID:**

1. Få noen med tilgang til å gå til [vault.tihlde.org](https://vault.tihlde.org) (husk eduroam/NTNU VPN)
2. Naviger til riktig collection og prosjekt
   - Hvis prosjektet ikke finnes: opprett en ny collection og legg inn miljøvariablene
3. Klikk inn på miljøvariablene til prosjektet
4. Se i URL-en i nettleseren - Item ID er den lange strengen etter `itemId`:

   ```
   https://vault.tihlde.org/#/vault?itemId=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee&action=view
                                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                     Dette er Item ID-en
   ```

5. Kopier denne ID-en - du trenger den i neste steg

## 5. Legg til secrets i GitHub

Deploy-workflowen trenger to konfigurasjonsverdier for å fungere. Disse må legges til i GitHub-repoet.

### Steg 1: Gå til repo settings

Gå til repoet på GitHub og naviger til:

**Settings → Secrets and variables → Actions**

### Steg 2: Legg til secret

Klikk på **Secrets**-fanen, deretter **New repository secret**.

Legg til følgende secret:

| Navn                  | Verdi                                         |
| --------------------- | --------------------------------------------- |
| `VAULTWARDEN_ITEM_ID` | Item ID-en du hentet fra Vaultwarden i steg 4 |

### Steg 3: Legg til variabel

Klikk på **Variables**-fanen, deretter **New repository variable**.

Legg til følgende variabel:

| Navn                | Verdi                                                                   |
| ------------------- | ----------------------------------------------------------------------- |
| `WORKING_DIRECTORY` | Mappen der prosjektet ligger på Adelie (f.eks. `/root/<prosjekt-navn>`) |

{% callout title="Organization secrets og variables" type="note" %}
Nederst på siden ser du en liste over secrets/variables som er arvet fra TIHLDE-organisasjonen (f.eks. SSH-nøkler). Disse er tilgjengelige for alle repos i organisasjonen. Hvis du trenger å overskrive en av disse for ditt prosjekt, kan du legge til en secret/variable med samme navn på repo-nivå.
{% /callout %}

## 6. Nginx-konfigurasjon

Nå må vi sette opp Nginx til å route den innkommende trafikken fra Chinstrap til riktig Docker-container på Adelie.

### Steg 1: Gå til nginx-konfigurasjonsmappen på Adelie

```bash
[navn@dritraskpc ~]$ ssh adelie
root@adelie:~# cd /etc/nginx/sites-available/
```

### Steg 2: Kopier template

Kopier template-filen og gi den et beskrivende navn:

```bash
cp template.conf <prosjekt>.tihlde.org.conf
```

**Eksempel:**

```bash
cp template.conf blitzed.tihlde.org.conf
```

### Steg 3: Rediger konfigurasjonsfilen

Åpne den nye konfigurasjonsfilen med din favoritt-editor (nano/nvim/vim):

```bash
nano <prosjekt>.tihlde.org.conf
```

**Gjør følgende endringer:**

1. Bytt ut alle forekomster av `<NAME>` med subdomenet du vil bruke (uten angular brackets)
   - Eksempel: `blitzed` hvis domenet skal være `blitzed.tihlde.org`
2. Bytt ut alle forekomster av `<PORT>` med porten Docker-containeren kjører på (uten angular brackets)
   - Dette må være samme port som du satte i `deploy.sh`

### Steg 4: Aktiver konfigurasjonen

Opprett en symlink fra `sites-available` til `sites-enabled`:

```bash
ln -s ../sites-available/<prosjekt>.tihlde.org.conf /etc/nginx/sites-enabled/
```

{% callout title="Hvorfor symlink?" type="note" %}
Nginx bruker kun konfigurasjonsfiler som ligger i `sites-enabled`-mappen. Vi bruker symlinks i stedet for å kopiere filen fordi:

- Originalfilen ligger trygt i `sites-available`
- Vi kan enkelt deaktivere nettsiden ved å slette symlinken (uten å miste konfigurasjonen)
- Vi kan enkelt aktivere nettsiden igjen ved å opprette symlinken på nytt

{% /callout %}

### Steg 5: Test og reload Nginx

Test at konfigurasjonen er gyldig:

```bash
nginx -t
```

Denne skal rapportere: **"test is successful"**

Hvis testen er vellykket, reload Nginx:

```bash
nginx -s reload
```

### Steg 6: Commit endringene

Husk å committe Nginx-konfigurasjonen til Adelie sitt Git-repo:

```bash
git add .
git commit -m "[Ditt Navn] Added <prosjekt> Nginx config"
git push
```

## 7. Deploy prosjektet

Nå er alt klart for første deployment!

Gå til prosjektmappen på Adelie:

```bash
cd /root/<prosjekt>
```

Gjør deploy-scriptet kjørbart og kjør det:

```bash
chmod u+x deploy.sh
./deploy.sh
```

Scriptet vil nå:

1. Hente miljøvariabler fra Vaultwarden (hvis nødvendig)
2. Bygge Docker-image
3. Stoppe gammel container (hvis den kjører)
4. Starte ny container
5. Kjøre eventuelle database-migreringer

{% callout title="Overvåk deployment" type="note" %}
Hold øye med outputen fra deploy-scriptet for å sikre at alt går bra.
{% /callout %}

## 8. DNS-oppsett

Siste steg er å sette opp DNS slik at domenet peker til riktig sted.

### Finn noen med Domeneshop-tilgang

Finn noen med tilgang til TIHLDEs [Domeneshop](https://domene.shop)-konto.

### Legg til CNAME-record

Be dem om å legge til en **CNAME DNS-record** med følgende verdier:

| Felt  | Verdi              |
| ----- | ------------------ |
| Host  | `<prosjekt>`       |
| Type  | CNAME              |
| Verdi | `drift.tihlde.org` |
| TTL   | 300 (5 minutter)   |

**Eksempel for blitzed.tihlde.org:**

| Felt  | Verdi              |
| ----- | ------------------ |
| Host  | `blitzed`          |
| Type  | CNAME              |
| Verdi | `drift.tihlde.org` |
| TTL   | 300                |

{% callout title="DNS-propagering" type="note" %}
Det kan ta noen minutter før DNS-endringen propagerer. Du kan sjekke status med `nslookup <prosjekt>.tihlde.org` eller ved å besøke domenet i nettleseren.
{% /callout %}

---

## Ferdig! 🎉

Nettsiden din skal nå være tilgjengelig på `<prosjekt>.tihlde.org`!

### Fremtidige deployments

Fra nå av vil GitHub workflow automatisk deploye nye versjoner når du pusher til hovedbranchen. Du trenger ikke å gjøre noe manuelt med mindre noe går galt.

### Feilsøking

Hvis noe ikke fungerer:

- **Sjekk Nginx-logger:** `tail -f /var/log/nginx/error.log`
- **Sjekk Docker-container:** `docker logs <container-navn>`
- **Sjekk at containeren kjører:** `docker ps`
- **Sjekk at porten og domene er riktig:** Se i `deploy.sh` og Nginx-config
- **Sjekk DNS:** `nslookup <prosjekt>.tihlde.org`

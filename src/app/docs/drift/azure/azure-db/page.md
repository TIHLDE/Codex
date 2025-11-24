# Azure DB

I Azure finnes det flere måter å kjøre databaser på, avhengig av behov for kontroll, skalering og kostnader. For oss i TIHLDE er det viktig å forstå forskjellene mellom ulike tilnærminger, og hvordan vi kan sette opp databaser som fungerer på tvers av miljøer.

## Valg av database

TIHLDE bruker **MySQL** som database, og kjører en **Azure Database for MySQL Flexible Server** knyttet direkte til backend-tjenesten Lepton. Denne databasen er tilgjengelig for alle tjenestene våre, uavhengig av hvor de kjører – enten det er on-prem i NTNU OpenStack, i Azure eller hos Vercel. Det gir oss fleksibilitet til å dele data på tvers av plattformer, samtidig som databasen ligger trygt og privat i Azure.

Det er verdt å merke seg at **PostgreSQL** har blitt stadig mer populært de siste årene, og mange nye prosjekter velger dette fremfor MySQL. PostgreSQL har bedre støtte for avanserte datatyper, JSON og geografiske data.

## Deployment-alternativer

Azure tilbyr flere måter å kjøre databaser på, og det er viktig å forstå hva som skiller dem:
### Single Server (utgått modell)

Dette var den første versjonen av administrerte databaser i Azure, men Microsoft anbefaler nå at alle går over til **Flexible Server**. Single Server har begrenset konfigurasjonsmuligheter og mangler støtte for nyere funksjoner som VNet-integrasjon og automatisk backup til egne storage accounts.

### Flexible Server (anbefalt)

**Flexible Server** er den moderne deployment-modellen for MySQL og PostgreSQL i Azure. Den gir mer granulær kontroll over databaseinnstillinger, nettverksisolasjon og skaleringsmuligheter. Med Flexible Server kan vi:

* Velge mellom forskjellige pricing tiers basert på ytelseskrav  
* Integrere databasen direkte i et VNet for privat tilgang  
* Konfigurere backup, oppetid og vedlikeholdsvinduer mer detaljert

I motsetning til eldre modeller, lar Flexible Server oss provisjonere en spesifikk compute-størrelse innenfor en valgt pricing tier – som **Burstable**, **General Purpose** eller **Memory Optimized**. Dette gir forutsigbarhet i både ytelse og kostnader.

### Serverless Compute Tier (ikke Flexible Server)

Det finnes også en **Serverless Compute Tier** for Azure SQL Database, som automatisk skalerer compute-ressursene basert på etterspørsel og fakturerer per sekund. Dette er designet for sporadiske eller uforutsigbare arbeidsbelastninger, men gjelder kun for SQL Database – ikke MySQL eller PostgreSQL Flexible Server. Serverless er nyttig hvis man vil minimere kostnader ved å kun betale for aktivitet, men det krever at databasen kan tåle oppstartsforsinkelser når den "våkner" fra inaktivitet.

## Pricing tiers i Flexible Server

Når vi setter opp en Flexible Server, må vi velge en **pricing tier** som passer bruksområdet:

* **Burstable:** Lavest kostnad, passer for utvikling og testing der databasen ikke kjører kontinuerlig med høy last  
* **General Purpose:** Balansert ytelse for produksjonsmiljøer med moderat trafikk  
* **Memory Optimized:** Høy ytelse for tunge arbeidsbelastninger med mange samtidige spørringer

I TIHLDE bruker vi typisk General Purpose for produksjon, mens utviklingsmiljøer kan kjøre på Burstable for å holde kostnadene nede.

## Nettverkstilgang og VNet

Som vi så i forrige kapittel om VNet, kan vi koble databasen til et **privat subnett**. Dette betyr at databasen ikke har noen offentlig IP-adresse, og er kun tilgjengelig fra ressurser inne i VNetet – for eksempel en Azure Container App. For å gjøre dette må subnettet være **delegert** til MySQL Flexible Server, slik at Azure vet at dette nettverket er reservert for databasen.

Når databasen ligger i et VNet, slipper vi å eksponere den på internett, og all kommunikasjon går via private IP-adresser. Dette er både tryggere og raskere, siden trafikken aldri forlater Azures nettverk.

## Lifecycle-blokk i Terraform

Når vi jobber med databaser i Terraform, er det viktig å være forsiktig med endringer som kan føre til at ressursen må gjenskapes. Hvis Terraform mener at en endring krever en ny database, vil den prøve å slette den gamle og lage en ny – noe som kan føre til datatap.

For å unngå dette bruker vi en **lifecycle-blokk** i Terraform:

resource "azurerm\_mysql\_flexible\_server" "example" {  
  name                \= "example-db"  
  \# ... andre attributter

  lifecycle {  
    prevent\_destroy \= true  
    ignore\_changes  \= \[administrator\_password\]  
  }  
}

Her gjør vi to ting:

* **prevent\_destroy** stopper Terraform fra å slette databasen ved en feil, selv om konfigurasjonen sier det  
* **ignore\_changes** lar oss ignorere endringer i spesifikke attributter (som passord), slik at vi kan oppdatere disse manuelt uten at Terraform prøver å overskrive dem

Lifecycle-blokker er et kraftig verktøy for å beskytte kritiske ressurser, og de brukes ofte på databaser, storage accounts og andre tjenester der datatap kan være katastrofalt.

### **Challenge\!**
**Med Terraform:** Sett opp en **Azure Database for PostgreSQL Flexible Server** i et VNet, og koble den til en **Azure Container App (ACA)**. Målet er å holde databasen helt låst (privat), mens ACA er tilgjengelig offentlig. ACA skal kunne koble seg til databasen via VNet.

\*\* Kommer image for container app og vars til DB, når vi har satt opp en container registry \*\*

*Tips: Opprett et subnett for databasen og deleger det til MySQL Flexible Server. Bruk en connection string i ACA som peker på databasens private adresse. Husk å sette opp riktige brannmurregler og sikre at ACA har tilgang til riktig subnett.*
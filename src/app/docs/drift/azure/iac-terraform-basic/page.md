# IaC & Terraform basic

## Hva er IaC
Infrastructure as Code (IaC) betyr at vi definerer infrastruktur med kode i stedet for å klikke oss rundt i Azure-portalen. Dette gir bedre oversikt, versjonskontroll og gjør det enkelt å gjenskape eller endre oppsett.

## Hva er Terraform
Terraform er et av de mest brukte verktøyene for IaC, og gjør det mulig å skrive kode som oppretter og administrerer alle type ressurser fra flere leverandører. Vi fokuserer på Azure.  
Sjekk ut: [Azure | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/tutorials/azure-get-started?utm_source=chatgpt.com)

### **Challenge\!**
Fullfør introduksjonskurset over ^  
*(Ikke viktig med Service Principal-bruker eller remote state nå – men husk: aldri push Terraform state til Git\!)*

Dette kurset kan fullføres med en gratis Azure-konto, eller du kan høre med **Leder for Drift** eller **Index** for tilgang til TIHLDE sin lisens. 

## Best practice: Filinndeling i Terraform

I Terraform er det vanlig å dele opp koden i flere filer for å gjøre den mer oversiktlig og enklere å vedlikeholde. Når du kjører terraform-kommandoene, blir alle .tf-filene i mappen lest som ett samlet oppsett. Derfor kan vi organisere koden i tematiske filer i stedet for å samle alt i én.

Eksempel trestruktur:  
*tihlde-web-dev/*  
*├─ provider.tf         \# provider \+ auth mot Azure*  
*├─ main.tf              \# "orkestrerer" ressursene på toppnivå (RG / locals)*  
*├─ variables.tf       \# variabeldeklarasjoner*  
*├─ vnet.tf              \# nettverk \+ subnets*  
*├─ containers.tf     \# ACA / App Service / ACI*   
*├─ storage.tf           \# storage accounts (blob/file/queues)*  
*├─ database.tf        \# mysql/psql-config*

Ved å dele opp koden slipper du en gigantisk fil, og teamet finner raskt riktig sted å endre. Oppdelingen er fleksibel – noen ganger samler man alt i én fil for en liten oppgave, andre ganger deler man opp mer når prosjektene blir større.

# Variables og .Tfvars

### Hva er variables?
Variables i Terraform defineres i en variables.tf\-fil, hvor vi kan angi description, type, default og om verdien skal være sensitive. Dette gjør at koden blir mer strukturert og tydelig, samtidig som vi får en standardisert måte å håndtere input på.

### Hvorfor bruker vi variables?
Vi bruker variables for å unngå hardkoding og gjøre koden mer fleksibel og gjenbrukbar på tvers av prosjekter og miljøer. Det gir også bedre endringshåndtering, siden vi kan justere en verdi på ett sted uten å måtte lete gjennom alle filer.

### Hva er en .tfvars\-fil, og hvorfor brukes den?
En .tfvars\-fil brukes til å sette konkrete verdier på variabler, ofte for å skille mellom miljøer som dev, test og prod. Den er også nyttig for sensitive verdier som ikke bør pushes til Git, slik at man kan holde kildekoden ren og trygg.

### Hvilke andre løsninger kan vi bruke i kombinasjon med variables?
I tillegg til variables.tf kan vi bruke ressursreferanser, som lar ressurser peke direkte til hverandre. For eksempel azurerm\_resource\_group.rg.name eller "${azurerm\_resource\_group.rg.name}-law", slik at verdier oppdateres automatisk når en ressurs endres. Ved å kombinere variables med ressursreferanser unngår vi også å måtte definere unødvendig mange variables.

# Tags og locals-blokk

### Hva er tags i Azure, og hvorfor er de viktige? 
Tags er nøkkel-verdi-par som legges på ressurser, for eksempel `environment=training,` `managed_by=terraform` eller `team=team-x`. De er helt sentrale for **kostnadsstyring**, fordi du kan bryte ned forbruk etter prosjekt, miljø eller avdeling i Azure Cost Management. I tillegg brukes tags ofte til drift og styring – for eksempel å filtrere logger i Log Analytics, sette opp Azure Policy for å håndheve standarder, automatisere livssyklus (rydde opp gamle ressurser), eller gi rask oversikt over hvem som eier en ressurs.

### Hvorfor bruke locals for tags?
Ved å samle tags i en `locals`\-blokk slipper vi å gjenta dem i hver ressurs. Det gir konsistens på tvers av prosjektet, enklere vedlikehold, og reduserer risikoen for feil. Vi kan legge til `tags = local.common_tags` i en hvilken som helst ressursblokk. Da arver alle ressurser samme sett med standardiserte tags.

Her er et eksempel på tags definert med local-blokk i en main.tf fil:

\`\`\`hcl

locals {

  common\_tags \= {

    environment \= "dev"

    project     \= "disaster recovery"

    managed\_by  \= "terraform"

    team      \= "drift"

  }

}

\`\`\`

**Gjerne sjekk ut hvordan både tags, local-blokker og variables er brukt i “infrastructure” mappen i Lepton repoet. Merk at .tfvars ikke ligger selve repoet.** 

# Tips & tricks\!

Alltid husk terraform destroy når du er ferdig med testing og challenges – ellers risikerer du unødvendige kostnader i Azure.

Husk også at GPT kan gi små syntaksfeil og ikke alltid er til å stole på for mer kompleks Terraform-kode. Usikker på hvordan en ressurs eller modul brukes? Da er [Terraform Registry](https://registry.terraform.io/) alltid beste kilde.

### **Nyttige kommandoer:**

az login \--tenant \<din-tenant-id\>

terraform init

terraform validate

terraform plan

terraform apply

terraform destroy

**Ekstra tips:**

* Legg alltid \*.tfvars og terraform.tfstate i .gitignore for å unngå å pushe sensitive data.  
* Bruk terraform fmt for å holde koden konsistent og lettlest.  
* Sjekk ressursgrenser i Azure før du kjører store deployments – det sparer deg for feilmeldinger.
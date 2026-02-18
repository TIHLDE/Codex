# Azure læringsløp

Dette læringsløpet gir en praktisk innføring i Microsoft Azure med fokus på det som er nyttig for å hoste webapplikasjoner – slik som TIHLDE sin nettside.  
Målet er å få en forståelse for hvordan man setter opp infrastruktur som kode, hoster containere, og administrerer kostnader og ressurser i Azure.

## Intro fordelt i kapitler: 
- IaC & Terraform basic
- Azure Resources og RG
- Azure Containers
- Azure Cost Management
- Azure Vnet
- Azure DB
- Azure Storage Account
- Terraform Intermediate
- Azure container registry
## Intro Azure & Cloud Computing

Cloud computing betyr at man leier datakraft, lagring og tjenester fra en leverandør i stedet for å drifte alt selv. Microsoft Azure er en av de største plattformene, og tilbyr alt fra virtuelle maskiner (**IaaS**) til ferdige applikasjonstjenester som databaser og web hosting (**PaaS**) og programvareløsninger som Teams og Office 365 (**SaaS**).

Ønsker du først og fremst å ta en sertifisering? Sjekk ut **AZ-900: Azure Fundamentals**. Les mer her: [Microsoft Certified: Azure Fundamentals \- Certifications | Microsoft Learn](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/?practice-assessment-type=certification)  
Der ligger det også et tilknyttet gratis “Course”. 

Det finnes masse gode og gratis ressurser på YouTube, og du kan også sjekke ut plattformer som **Pluralsight, Udemy og Codecademy** for mer strukturert og utdypende opplæring. 

Alle disse sertifiseringsløpene er imidlertid hovedsakelig teoretiske og går ikke så mye inn på de praktiske verktøyene og tjenestene vi faktisk bruker i prosjekter. 

Feltet er enormt, men i dette læringsløpet fokuserer vi på det mest relevante for å hoste webapplikasjoner i Azure – med en praktisk tilnærming som gir erfaring med verktøyene TIHLDE selv bruker.

**Her kommer en oversikt over stegene i læringsløpet\!**
### IaC & Terraform basic

Her ser vi på hva Infrastructure as Code (IaC) er, og hvordan vi kan bruke Terraform til å administrere ressurser i Azure.
### Azure Resources og RG

Her lærer vi hvordan Azure organiserer tjenester i ressurser og resource groups (RG), og hvordan vi kan strukturere prosjektene våre med navnekonvensjoner.
### Azure Containers

Her ser vi på de viktigste løsningene i Azure for container-hosting.   
Vi legger fokuset på:  
\- Azure Container Instances (ACI)  
\- Azure App Service (Web Apps for Containers)  
\- Azure Container Apps (ACA)
### Azure Cost Management

Her bruker vi Azure-portalen for å få innsikt i hvor mye ressurser og prosjekter koster, og ser kort på hvordan prising i Azure fungerer. 
### Azure Vnet

Her lærer vi hvordan vi sikrer instanser, setter nettverksregler og legger til rette for å koble sammen tjenester. 
### Azure DB

En introduksjon til Azure sine database-løsninger, og hva vi bruker i TIHLDE.
### Azure Storage Account

Perfekt for lagring av Terraform-state, database-backuper og annen ustrukturert data.
### Terraform Intermediate

Her ser vi videre på mer avansert funksjonalitet i Terraform, som gjør verktøyet ekstra kraftig\! 
### Azure container registry

Azure sin løsning for å lagre container-images på en trygg måte – et alternativ til Docker Hub.
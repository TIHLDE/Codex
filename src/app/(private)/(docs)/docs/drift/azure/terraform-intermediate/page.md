# Terraform Intermediate

Etter å ha jobbet med grunnleggende Terraform og sett hvordan vi setter opp ressurser i Azure, er det tid for å ta steget videre. I denne guiden skal vi se på verktøy og teknikker som gjør Terraform-oppsettet vårt mer robust, skalerbart og egnet for samarbeid i team. Dette er funksjonalitet du ikke trenger fra dag én, men som blir viktig når prosjektene vokser og flere skal jobbe sammen om infrastrukturen.

## Data blocks – hente eksisterende ressurser

Så langt har vi kun **opprettet** ressurser med `resource`\-blokker. Men hva hvis vi trenger å referere til noe som allerede finnes – en resource group fra et annet prosjekt, en VNet opprettet av et annet team, eller en subscription-ID vi ikke selv administrerer?

Da bruker vi en **data block**. En data block lar oss hente informasjon om ressurser som eksisterer utenfor vår egen Terraform-kode, enten fordi de er opprettet manuelt, av en annen Terraform-konfigurasjon, eller av en helt annen løsning.

**Eksempel:**

data "azurerm\_resource\_group" "existing" {  
  name \= "tihlde-shared-rg"  
}

resource "azurerm\_storage\_account" "example" {  
  name                \= "examplestorage"  
  resource\_group\_name \= data.azurerm\_resource\_group.existing.name  
  location            \= data.azurerm\_resource\_group.existing.location  
  \# ...  
}

Her henter vi en eksisterende resource group, og bruker dens navn og location når vi oppretter en storage account. Dette er nyttig når infrastrukturen er delt mellom flere prosjekter, eller når noen ressurser er satt opp utenfor Terraform.

Data blocks er også nyttige for å hente informasjon fra Azure selv, for eksempel tilgjengelige VM-størrelser, IP-ranges eller subscription-detaljer, uten at vi trenger å hardkode dem.

## Remote backend – delt state med Storage Account

Når vi kjører Terraform lokalt, lagres tilstanden i en `terraform.tfstate`\-fil på maskinen vår. Dette fungerer fint for enkle tester, men skaper problemer når flere skal jobbe sammen:

* Hvem har den nyeste versjonen av state-filen?  
* Hva skjer hvis to personer kjører `terraform apply` samtidig?  
* Hvordan får en CI/CD-pipeline tilgang til state?

Løsningen er en **remote backend**, der state-filen lagres i en Azure Storage Account. Da får alle tilgang til samme tilstand, og Terraform kan låse filen mens noen jobber med den – slik at vi unngår konflikter.

**Fordeler med remote state:**

* **Samarbeid:** Alle i teamet ser samme tilstand  
* **Sikkerhet:** State ligger trygt i Azure, ikke på lokale maskiner  
* **CI/CD:** Pipelines kan deploye uten å måtte håndtere state-filer manuelt  
* **Låsing:** Azure Storage støtter state locking, slik at bare én person kan gjøre endringer om gangen

I TIHLDE bruker vi remote backend for all produksjonsinfrastruktur. Det gjør at vi kan kjøre deployments fra GitHub Actions uten at noen trenger å ha state-filen lokalt.

**Oppsett:**

terraform {  
  backend "azurerm" {  
    resource\_group\_name  \= "terraform-state-rg"  
    storage\_account\_name \= "tfstatestorage"  
    container\_name       \= "tfstate"  
    key                  \= "prod.terraform.tfstate"  
  }  
}

State-filen lastes nå opp til en blob container i Azure, og alle som kjører Terraform mot dette prosjektet bruker samme tilstand.

## RBAC og service accounts for CI/CD

Når vi setter opp automatiserte deployments i en CI/CD-pipeline, trenger vi en **service account** – en bruker som pipelinen kan logge inn som for å kjøre Terraform. Dette gjøres med **Azure Service Principal** eller **Managed Identity**, og styres med **Role-Based Access Control (RBAC)**.

En service principal er en identitet som kan tildeles rettigheter i Azure, uten at vi trenger å bruke en personlig brukerkonto. Vi kan gi den akkurat de tilgangene den trenger – for eksempel `Contributor` på en resource group – slik at pipelinen kan opprette og administrere ressurser, men ikke gjøre endringer utenfor sitt ansvarsområde.

**Hvorfor er dette viktig?**

* **Sikkerhet:** Pipelinen får kun de rettighetene den trenger, ikke mer  
* **Sporbarhet:** Vi ser tydelig hvilke endringer som er gjort av automatisering vs. manuelle handlinger  
* **Stabilitet:** Ingen avhengighet av personlige brukere – hvis noen slutter, fungerer pipelinen fortsatt

## Workspaces – flere miljøer i samme kode

Terraform støtter **workspaces**, som lar oss bruke samme kode til å administrere flere miljøer – for eksempel `dev`, `test` og `prod`. Hvert workspace har sin egen state-fil, slik at endringer i dev ikke påvirker prod.

**Hvordan fungerer det?**

Når vi oppretter et workspace, kan vi bruke `terraform.workspace` i koden vår til å sette miljøspesifikke verdier:

locals {  
  environment \= terraform.workspace  
  sku \= terraform.workspace \== "prod" ? "Premium" : "Basic"  
}

resource "azurerm\_mysql\_flexible\_server" "db" {  
  name \= "db-${local.environment}"  
  sku\_name \= local.sku  
  \# ...  
}

Her får vi en premium-database i prod, men en basic-database i dev – alt styrt av hvilket workspace vi jobber i.

**Bruk i TIHLDE:**

Vi har tidligere brukt workspaces til å skille mellom `prod` og `dev` i Azure, men har nå faset ut dev-miljøet fra Azure. Likevel er det nyttig å kjenne til konseptet, siden mange organisasjoner bruker dette for å administrere flere miljøer med samme kodebase.

Workspaces kan også kombineres med navnekonvensjoner, slik at ressursnavnene tydelig viser hvilket miljø de tilhører – for eksempel `rg-tihlde-web-dev` vs `rg-tihlde-web-prod`.

## Lifecycle Management – beskytte kritiske ressurser

Som vi har sett i flere av guidene, kan vi bruke **lifecycle-blokker** til å kontrollere hvordan Terraform håndterer ressurser. De to viktigste valgene er:

* **prevent\_destroy:** Stopper Terraform fra å slette ressursen, selv om konfigurasjonen sier det. Kritisk for databaser og storage accounts.  
* **ignore\_changes:** Lar oss ignorere endringer i spesifikke attributter, slik at manuelle justeringer ikke overskrives ved neste `terraform apply`.

**Eksempel:**

resource "azurerm\_storage\_account" "critical" {  
  name \= "criticalstorage"  
  \# ...

  lifecycle {  
    prevent\_destroy \= true  
    ignore\_changes  \= \[tags\]  
  }  
}

Dette beskytter storage accounten mot sletting, og lar oss legge til tags manuelt uten at Terraform prøver å fjerne dem.

Lifecycle-blokker er særlig viktige i produksjonsmiljøer, der en feil i konfigurasjonen ikke skal føre til at kritiske data blir slettet.
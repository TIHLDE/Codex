# Azure VNet

I Azure må vi ofte tenke på hvordan tjenestene våre skal snakke sammen, og hvordan vi styrer tilgang til dem. Et **Virtual Network (VNet)** fungerer som et privat nettverk i skyen – det gir oss kontroll over kommunikasjon, sikkerhet og trafikkflyt mellom ressursene våre.

## Hva er et VNet

Et VNet er som et lokalt nettverk (LAN), bare i Azure. Det lar oss koble sammen ressurser slik at de kan kommunisere trygt, samtidig som vi kan bestemme hva som skal være tilgjengelig fra internett og hva som skal være helt privat. Dette gir oss mulighet til å:

* La ressurser kommunisere med hverandre internt  
* Styre hvordan trafikk går inn og ut av systemet vårt  
* Beskytte sensitive tjenester som databaser

## Hvorfor trenger vi VNet

Når vi setter opp tjenester i Azure, står de som standard isolert fra hverandre. Med et VNet kan vi:

* **Koble ressurser sammen:** En container kan snakke med en database uten å gå via internett  
* **Kontrollere eksponering:** Vi kan låse ned tjenester helt, eller bare åpne spesifikke porter og protokoller  
* **Integrere Azure-tjenester:** Storage Accounts, databaser og andre tjenester kan gjøres tilgjengelige kun internt i nettverket

I TIHLDE bruker vi VNet til å holde databasen vår privat, samtidig som vi lar containere få tilgang. Dette gjør oppsettet både tryggere og mer fleksibelt.

## Subnett – deling av nettverket

Inne i et VNet lager vi **subnett**, som er mindre nettverkssegmenter. Hvert subnett får tildelt en del av VNetets adresserom, og vi kan bruke dem til å organisere tjenester. For eksempel kan vi ha ett subnett for databaser og ett for containere. Dette gjør det enklere å sette sikkerhetsregler og holde orden på hvilke ressurser som skal kunne snakke sammen.

Når vi oppretter et subnett, angir vi et **adresseområde** (for eksempel `10.0.8.0/21`). Dette definerer hvor mange IP-adresser subnettet kan tildele, og gir rom til flere instanser uten at vi trenger å endre oppsettet senere.

## Network Security Groups (NSG) – trafikkontroll

For å styre trafikken bruker vi **Network Security Groups (NSG)**. En NSG er en samling regler som bestemmer hvilken trafikk som skal tillates eller blokkeres. Reglene har en prioritet – lavere tall betyr høyere prioritet – og de kan filtrere på port, protokoll, kilde og destinasjon.

Azure kommer med noen innebygde regler, som `AllowVnetInBound` og `AllowVnetOutBound`. Disse tillater trafikk mellom ressurser i samme VNet, noe som gjør intern kommunikasjon enkel. Hvis vi vil åpne opp for internett eller blokkere spesifikke tjenester, legger vi til egne regler med lavere prioritet.

## Private DNS Zone – navnoppslag internt

Når ressurser skal finne hverandre i VNetet, trenger de ikke offentlige domenenavn. I stedet bruker vi en **Private DNS Zone**, som oversetter interne navn til private IP-adresser. Dette gjør at en container kan koble seg til databasen via et lesbart navn, uten at dette er synlig utenfor nettverket.

For at dette skal fungere, må vi **linke DNS-sonen til VNetet**. Da kan alle ressurser i nettverket bruke denne DNS-en til å slå opp adresser, og vi slipper å hardkode IP-adresser i koden vår.

## Delegering av subnett

Noen Azure-tjenester krever at et subnett er **delegert** til dem. Det betyr at subnettet er reservert for én bestemt tjenestetype, som for eksempel en MySQL Flexible Server. Delegeringen gir tjenesten lov til å koble seg til subnettet og bruke IP-adresser derfra. Uten delegering kan ikke tjenesten opprettes med privat tilgang.

## TIHLDE sitt oppsett

I TIHLDE bruker vi VNet til å holde databasen privat og la containerapplikasjonene våre kommunisere trygt med den. Vi har:

* Ett VNet med adresserom `10.0.0.0/16`  
* Ett subnett for databasen (`10.0.8.0/21`), delegert til MySQL Flexible Server  
* Ett subnett for containere (`10.0.16.0/21`)  
* En Private DNS Zone som lar containerne finne databasen via navn  
* En NSG som styrer hvilken trafikk som tillates

Denne strukturen gir oss kontroll, sikkerhet og mulighet til å vokse uten å måtte omstrukturere nettverket.

### **Challenge!**
**Med Terraform:** Sett opp en **Azure Container App (ACA)** med VNet-integrasjon. Målet er å låse ned ACA-instansen slik at den ikke er direkte eksponert, men gjøre den tilgjengelig via VNet. Dette gjenspeiler hvordan vi kjører produksjonsmiljøet i TIHLDE.

\*\* Kommer custom image for container app, når vi har satt opp en container registry \*\*

*Tips: Du må opprette et VNet, et subnett for ACA, og konfigurere Container Apps Environment til å bruke dette subnettet. Husk at ACA krever et subnett med tilstrekkelig adresserom (vanligvis minst `/23`).*
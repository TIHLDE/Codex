# Azure Containers

I Azure finnes det flere måter å kjøre containere på, avhengig av behov. En **container** er en lettvekts pakke som inneholder både kode og nødvendige avhengigheter, slik at applikasjonen kjører likt uansett hvor den deployes. Dersom du er usikker på hva en container er, eller ikke fulgte med på Docker-kurset under oppstarten, finner du en introduksjon på Codex-siden. I dette kurset skal vi derimot fokusere på **hvordan containere brukes i Azure**.
## Azure Container Instances (ACI) – rask oppstart

ACI er den enkleste måten å kjøre en container på i Azure. Du peker på et container image (for eksempel fra Docker Hub), og Azure starter det for deg. Du slipper å tenke på infrastruktur, og betaler kun for den tiden containeren faktisk kjører. Dette passer godt til testing, små dev prosjekter eller engangsoppgaver.

## Azure App Service – webapplikasjoner

App Service er en plattformtjeneste for web- og API-applikasjoner, og den kan også kjøre container images. Fordelen er at du får et ferdig oppsett for webapplikasjoner, med ting som tilkobling til domener, SSL-sertifikater og skalering. Hvis du har en container som skal fungere som en webtjeneste, er App Service et enkelt og effektivt valg.

### **Challenge\!**
**Med Terraform:** Sett opp en Azure App Service eller ACI med ferdig image fra Docker hub, og se om du når dem med public adresse.

\*\* Kommer info om custom image, når vi har satt opp en container registry \*\*

*Tips: Legg til en output block for å få adressen til instansen.*  
 *For Azure App Service vil value være default\_hostname til instansen.*  
 *For ACI vil value være ip\_address\[0\].fqdn}:${var.port}*

## Azure Container Apps (ACA) – moderne containerplattform

I TILHDE bruker vi ACA og er den vi fokuserer mest på videre i læringsløpet. ACA er en “serverless” plattform og laget for å kjøre applikasjoner som består av flere små containere, ofte kalt mikrotjenester. Med ACA får du autoskalering som kan reagere på trafikk eller belastning, og du kan enkelt koble applikasjoner sammen. Tjenesten kjører i bunn på Kubernetes, men du slipper å sette opp eller drifte clusteret selv. Dette gjør ACA til et godt valg for prosjekter som skal vokse eller krever mer fleksibilitet, samtidig som du beholder enkelheten fra en plattformtjeneste.

For at ACA skal fungere, opprettes et **Container Apps Environment**, som er rammen containerappene kjører i. Til dette knytter vi også et **Log Analytics Workspace**, som samler logger og gir innsikt i hvordan applikasjonene våre oppfører seg. Dette er viktig for å kunne følge med på drift, feilsøke og styre kostnader.

## Andre alternativer

Det finnes også mulighet til å kjøre containere direkte på virtuelle maskiner (VM), men dette er en IaaS-modell og krever mer arbeid samtidig som det gir mindre av fordelene med Azure sine plattformtjenester. For avanserte brukere finnes **Azure Kubernetes Service (AKS)**, som er den mest fleksible måten å kjøre containere i stor skala. I dette læringsløpet skal vi ikke gå inn på AKS, men det er nyttig å vite at det finnes.
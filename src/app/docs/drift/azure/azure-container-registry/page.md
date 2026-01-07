# Azure Container Registry

Når vi jobber med containere i Azure, trenger vi et sted å lagre container images trygt og effektivt. **Azure Container Registry (ACR)** er Azures egen løsning for dette, og fungerer som et alternativ til Docker Hub, GitHub Container Registry (GHCR) eller selvhostede løsninger som Harbor.

## Hva er ACR?

ACR er en privat registry for container images. Her kan vi pushe images som vi har bygget, og trekke dem ned igjen når vi skal deploye til Azure Container Apps, Azure Kubernetes Service eller andre containertjenester. Fordelen med ACR fremfor offentlige registries er at vi får full kontroll over tilgang, og at images ligger geografisk nært de tjenestene som skal bruke dem – noe som gir raskere nedlasting og ingen egress-kostnader innad i samme region.

## Når bruker vi ACR?

I TIHLDE bruker vi ACR primært for **images til tjenester som kjører i Azure**. Dette inkluderer Azure Container Apps og eventuelle andre containere som deployes i vårt Azure-miljø. For tjenester som kjører utenfor Azure – for eksempel på Openstack hos NTNU eller hos andre leverandører, bruker vi andre registries.

## Hvorfor bruker vi ikke ACR til alt?

Selv om Azure Container Registry (ACR) passer svært godt for bilder til tjenester som kjører i Azure-miljøet, finnes det situasjoner der andre registries gir bedre mening. For eksempel kan on-prem-løsninger eller registries som GitHub Container Registry (GHCR) fungere bedre når tjenestene kjører utenfor Azure og krav til tilgangskontroll, egress-kostnader på tvers av regioner eller compliance gjør det mer hensiktsmessig.
---
title: Lepton
---

## Beskrivelse

- **Hvorfor ble det til?** Da TIHLDE ville ha en egen nettside som ikke ble hostet på Wordpress, var det behov for en egen backend for å sette opp systemer.
- **Hvem er målgruppen?** Målgruppen er alle medlemmer av TIHLDE, samt eksterne interessenter som har interesse av TIHLDE, slik som studenter, lærere og bedrifter.
- **Hvilke funksjoner og krav oppfyller prosjektet?** Lepton fyller flere krav, og fyller stadig nye krav. Dette er alt fra en felles autentisering- og autorisasjontjeneste for TIHLDE, samt systemer for arrangementer, nyheter, grupper osv.
- **Status til prosjektet:** Prosjektet er fortsatt i drift, og er per dags dato kjernen for all backend for TIHLDE sine systemer.

## Techstack

Lepton benytter seg av følgende teknologier:

- Django
- Django REST
- MySQL
- Celery
- RabbitMQ
- Docker
- Sentry
- Azure blob storage
- Pytest

### Django Core og REST

Django er et rammeverk som gir muligheten til å lage applikasjoner som kobler sammen frontend og backend på en enkel og effektiv måte. Vi i Index derimot har flere ulike applikasjoner som bygger på samme backend API. Dette vil si at vi bruker Django til å lage et alenestående API. Django REST er et bibliotek som bygger videre på Django sin grunnleggende funksjonalitet, men åpner for muligheten til å lage et API.

### MySQL og Django ORM

Vi bruker MySQL som database, som vil si at vi bruker sql som spørringspråk for å hente, lage, slette og opprette data i vår database. Vi bruker Django sin egen ORM for spørringer.

### Celery

Celery er verktøy som gir oss muligheten til å lage "tasks". Dette bruker vi blant annet for å sende ut daglige eposter til aktuelle medlemmer av TIHLDE klokken 12:00.

### RabbitMQ

RabbitMQ er det vi kaller en "message broker". Vi bruker dette for å sette opp køer for prosesser som kjører på backend.

### Docker

Docker er en plattform for containerisering som gjør det mulig å pakke en applikasjon sammen med alle dens avhengigheter, biblioteker og konfigurasjoner, slik at den kan kjøre konsistent på tvers av ulike miljøer. Ved å kjøre Lepton gjennom Docker, har vi ikke noe behov for å laste ned pakker, eller Python forsåvidt, for å kjøre koden vår. Dette resulterer i at alle kan kjøre samme kode uten problemer forårsaket av et noen bruker macOS og noen Windows.

### Sentry

Sentry overvåker ytelse for systemet vårt. Vi bruker det for å logge feil som skjer i systemet. Sentry gir oss også en egen webplattform der vi kan se detaljerte logger på feil som skjer. Vi får også ukentlige mail som varsler oss om antall feil per uke.

### Azure blob storage

Siden vi hoster både database, og Lepton på Azure, så er det naturlig at vi lagrer filer her også. Derfor har vi implementert Azure blob storage funksjonalitet for å kunne laste opp filer.

### Pytest

Når man utvikler et API er det viktig å teste koden. På denne måten kan vi teste koden opp i mot diverse relevante scenarioer. For å gjøre dette bruker vi Pytest.

## Hovedansvarlig

- Mads Nylund: madsnyl@gmail.com (15.08.2023 - )

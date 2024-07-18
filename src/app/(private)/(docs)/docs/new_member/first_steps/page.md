---
title: 'Første steg'
---

Velkommen til et nytt verv og Codex!

Du har mye spennende i vente og du skal lære mye nytt. For at du skal komme i gang er det flere ting du trenger for å komme i gang. Det er ikke nødvendigvis sikkert at du kommer til å bruke alt det vi lister opp her med en gang, men for at vi skal få i gang nye medlemmer mest mulig effektivt, så er vi avhengig av at dere har alt dette på plass. Hvis du møter på problemer så er det bare å si ifra til en av oss via Slack eller andre kommunikasjonsplattformer.

## Slack
Slack er kommunikasjonsplattformen vi i TIHLDE bruker for vervrelaterte saker. Her kommer du i kontakt med andre i ditt eget verv, men også andre i TIHLDE. Det vil også bli sendt ut møteinnkallinger og annen viktig informasjon her.

For å koble deg opp mot Slack og bli et medlem av TIHLDE sin workspace kan du prøve på følgende måte:

1. Logg inn på TIHLDE siden med din bruker.
2. Gå til din profil, ved å trykke på avatarikonet oppe til høyre.
3. Trykk på "innstillinger".
4. Trykk på "Koble til din Slack-bruker" knappen.
5. Du vil nå bli koblet opp mot TIHLDE sin Slack workspace.

Hvis ikke dette funker så gjør følgende:

1. Enten har du fått en invitasjon og da kan du følge instruksene på eposten du har fått, eller
2. Gå inn på [https://slack.com/signin](https://slack.com/signin) og lag en bruker.
3. Verifiser bruker med en epost du skal ha fått.
4. Her skal det være en mulighet til å søke opp et workspace (TIHLDE).
5. Trykk på "Join" knappen for worksapcet du vil bli med i.

## Pakkebehandler
Før du begynner å laste ned de diverse verktøyene kan det være gunstig å benytte seg av det man kaller en pakkebehandler. Dette er et verktøy som lar deg bruke terminalen til å laste ned pakker lettere istedenfor å trykke på masse knapper som du sikkert er vandt til.

For Mac og Linux bruker man noe som heter Homebrew og det kan lastes ned [her](https://brew.sh/). Hvis du velger denne ruten så kan du heller søke på Google hvordan du laster ned f.eks. Git med homebrew istedenfor å følge stegene nedenfor.

For Windows så er det ikke like nødvendig med dette siden de fleste pakker er justert for at det er lett å laste ned via en vanlig metode som man er kjent med. Men hvis man ønsker det samme som Mac og Linux kan du laste ned det tilsvarende [verktøyet Chocolatey her](https://docs.chocolatey.org/en-us/choco/setup/).

## IDE
Hvis du har vært i en forelesning enda har du mest sannsynlig fullført dette steget. Hvis ikke så er IDE et verktøy man bruker for å skrive og kjøre kode. Den vanligste IDE'en å benytte seg av er **Visual Studio Code** som er gratis. For å laste ned VSCode så besøk [nettsiden deres](https://code.visualstudio.com/), så vil det dukke opp en "last ned" knapp. Trykk på denne og følg instruksene.

## Git
![Git forklaring](https://media.dev.to/cdn-cgi/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fi%2Fmkumdyhyi1zbschhwgdy.png)

Git er et verktøy vi benytter oss for versjonskontroll. Som vist på bildet ser vi hvordan vi kan lage forskjellige *"branches"*. Dette gjør at vi kan jobbe med forskjellige ting uten å gå i veien for hverandre med koden. Og så til slutt *"merger"* vi inn vår branch inn i **MASTER**.

Vi bruker dette for å ha mer kontroll og muligheten til å gå tilbake til tidligere versjoner hvis det skjer noe feil.

Ved å [besøke hjemmesiden til git](https://git-scm.com/downloads) så finner du instrukser på hvordan man laster ned Git for din pc.

## GitHub
En annen grunn til at vi bruker Git er for å kunne bruke nettplattformen GitHub. GitHub er en plattform som lar oss laste opp og ned kode på et felles sted. På denne måten vil vi alle alltid ha tilgang til samme versjoner av kodebasen.

Du må dermed lage deg en bruker på GitHub slik at vi kan legge deg til i TIHLDE sitt arbeidsområde, slik at du får tilgang til våre ulike prosjekter. Gå til [GitHub](https://github.com/) for å lage en ny bruker. Vi anbefaler å lage bruker med din private epost, for deretter å legge til din NTNU skole epost som sekundær epost inne på din GitHub bruker tidligere. Ved å gjøre dette kan du få tilgang til diverse verktøy siden du er verifisiert student.

## Docker
Docker er et verktøy som vi kort forklart bruker for å kunne kjøre et utviklingsmiljø som er likt for alle uansett om man bruker Windows, Mac eller Linux. Med en gang man blir vant til det så gjør det livet mye lettere. Vi bruker det per nå primært for vår backend Lepton. 

For å laste det ned så må man laste ned [Docker Desktop her](https://www.docker.com/products/docker-desktop/). Deretter vil man få et ikon hjemskjermen din som du kan trykke på for å åpne. Du vil få spørsmål om du vil logge inn når du åpner, men ignorer dette og ikke logg inn. Det er ikke nødvendig.

Når du først har åpnet Docker, kan du lukke det og så kjører Docker i bakgrunnen. Etter det kan du bruke make kommandoer i Lepton for å kjøre backend og databasen lokalt.

Det er en mulighet å sette Docker til å kjøre i bakgrunnen hver gang man starter PC'en på nytt, men merk at Docker bruker mye strøm, hvertfall hvis du kjører Lepton api'et til enhver tid.

## Make
Make er et program vi bruker for å kunne kjøre kommandolinjer uten å måtte skrive de fullt ut hver gang. Istedenfor har vi en fil med et sett med make kommandoer, som f.eks. *make start*, som utfører en lengre kommandolinje for oss. Dette gjør det lettere å huske på ulike kommandoer. Igjen brukes dette primært for Lepton per nå.

For å laste ned Make på windows følg [instruksene her](https://gnuwin32.sourceforge.net/packages/make.htm). Det ser litt shady ut, men dette er et verktøy brukt av millioner av utviklere og er helt trygt. Alternativ med Chocolatey installert kan du kjøre kommandoen: choco install make

Hvis man har Homebrew installert så kjører man kommandoen: brew install make
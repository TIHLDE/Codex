---
title: 'Første steg'
---

Velkommen til et nytt verv og Codex!

Du har mye spennende i vente og du skal lære mye nytt. For at du skal komme i gang er det flere ting du trenger for å komme i gang. Det er ikke nødvendigvis sikkert at du kommer til å bruke alt det vi lister opp her med en gang, men for at vi skal få i gang nye medlemmer mest mulig effektivt, så er vi avhengig av at dere har alt dette på plass. Hvis du møter på problemer så er det bare å si ifra til en av oss via Slack eller andre kommunikasjonsplattformer.

## Discord
Discord er en kommunikasjonskanal vi bruker for å kommunisere oss imellom internt og med resten av TIHLDE. Du kan bli med i vår egen TIHLDE kanal ved å gjøre følgende:

1. Logg inn i TIHLDE siden med din bruker.
2. Gå til din profil.
3. Trykk på "innstillinger".
4. Trykk på "Koble til Discord"-knappen.
5. Du vil nå bli medlem av vår Discord kanal.

Hvis dette ikke går så kan du bare følge [denne lenken](https://discord.gg/HNt5XQdyxy)

## Pakkebehandler
Før du begynner å laste ned de diverse verktøyene kan det være gunstig å benytte seg av det man kaller en pakkebehandler. Dette er et verktøy som lar deg bruke terminalen til å laste ned pakker lettere istedenfor å trykke på masse knapper som du sikkert er vandt til.

For Mac og Linux bruker man noe som heter Homebrew og det kan lastes ned [her](https://brew.sh/). Hvis du velger denne ruten så kan du heller søke på Google hvordan du laster ned f.eks. Git med homebrew istedenfor å følge stegene nedenfor.

For Windows så er det ikke like nødvendig med dette siden de fleste pakker er justert for at det er lett å laste ned via en vanlig metode som man er kjent med. Men hvis man ønsker det samme som Mac og Linux kan du laste ned det tilsvarende [verktøyet Chocolatey her](https://docs.chocolatey.org/en-us/choco/setup/). Om du har Windows 11, så har du sansynligvis [WinGet](https://learn.microsoft.com/en-us/windows/package-manager/winget/) installert  om du bruker PowerShell.

## IDE
Hvis du har vært i en forelesning i et emne tilknyttet programmering har du mest sannsynlig fullført dette steget. Hvis ikke så er IDE et verktøy man bruker for å skrive og kjøre kode. Den vanligste IDE'en å benytte seg av er **Visual Studio Code** som er gratis. For å laste ned VSCode så besøk [nettsiden deres](https://code.visualstudio.com/), så vil det dukke opp en "last ned" knapp. Trykk på denne og følg instruksene.

## Git
![Git forklaring](https://media.dev.to/cdn-cgi/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fi%2Fmkumdyhyi1zbschhwgdy.png)

Git er et verktøy vi benytter oss for versjonskontroll. Som vist på bildet ser vi hvordan vi kan lage forskjellige *"branches"*. Dette gjør at vi kan jobbe med forskjellige ting uten å gå i veien for hverandre med koden. Og så til slutt *"merger"* vi inn vår branch inn i **MASTER**.

Vi bruker dette for å ha mer kontroll og muligheten til å gå tilbake til tidligere versjoner hvis det skjer noe feil.

Ved å [besøke hjemmesiden til git](https://git-scm.com/downloads) så finner du instrukser på hvordan man laster ned Git for din pc.

## GitHub
En annen grunn til at vi bruker Git er for å kunne bruke nettplattformen GitHub. GitHub er en plattform som lar oss laste opp og ned kode på et felles sted. På denne måten vil vi alle alltid ha tilgang til samme versjoner av kodebasen.

Du må dermed lage deg en bruker på GitHub slik at vi kan legge deg til i TIHLDE sitt arbeidsområde, slik at du får tilgang til våre ulike prosjekter. Gå til [GitHub](https://github.com/) for å lage en ny bruker. Vi anbefaler å lage bruker med din private epost, for deretter å legge til din NTNU skole epost som sekundær epost inne på din GitHub bruker. Ved å gjøre dette kan du få tilgang til diverse verktøy siden du er verifisiert student.

## Docker
Docker er et verktøy som vi kort forklart bruker for å kunne kjøre et utviklingsmiljø som er likt for alle uansett om man bruker Windows, Mac eller Linux. Med en gang man blir vant til det så gjør det livet mye lettere. Vi bruker det per nå primært for vår backend Lepton. 

For å laste det ned så må man laste ned [Docker Desktop her](https://www.docker.com/products/docker-desktop/). Deretter vil man få et ikon på hjemskjermen som du kan trykke på for å åpne. Du vil få spørsmål om du vil logge inn når du åpner, men ignorer dette og ikke logg inn. Det er ikke nødvendig.

Når du først har åpnet Docker, kan du lukke det og så kjører Docker i bakgrunnen. Etter det kan du bruke make kommandoer i Lepton for å kjøre backend og databasen lokalt.

Det er en mulighet å sette Docker til å kjøre i bakgrunnen hver gang man starter PC'en på nytt, men merk at Docker bruker mye strøm, hvertfall hvis du kjører Lepton api'et til enhver tid.

## Make
Make er et program vi bruker for å kunne kjøre kommandolinjer uten å måtte skrive de fullt ut hver gang. Istedenfor har vi en fil med et sett med make kommandoer, som f.eks. *make start*, som utfører en lengre kommandolinje for oss. Dette gjør det lettere å huske på ulike kommandoer. Igjen brukes dette primært for Lepton per nå.

For å laste ned Make på windows følg [instruksene her](https://gnuwin32.sourceforge.net/packages/make.htm). Det ser litt shady ut, men dette er et verktøy brukt av millioner av utviklere og er helt trygt. Alternativt med Chocolatey installert kan du kjøre kommandoen: `choco install make`. Om du bruker WinGet, så kan du kjøre kommandoen `winget install -e --id GnuWin32.Make`

Hvis man har Homebrew installert så kjører man kommandoen: brew install make

## Python
Python er et programmeringsspråk som vi bruker for vår backend Lepton og vår egen TIHLDE CLI.

For å laste ned Python på Windows, Mac og Linux, kan du følge disse instruksjonene:

### Windows:
1. Gå til [Python nedlastingssiden](https://www.python.org/downloads/windows/) i nettleseren din.
2. Klikk på "Last ned" for den nyeste versjonen av Python som passer til Windows.
3. Åpne den nedlastede filen og følg instruksjonene i installasjonsveiviseren.
4. Velg "Add Python to PATH" under "Customize installation" for å legge til Python i systemets PATH-miljøvariabel.
5. Klikk på "Install Now" for å starte installasjonen.
6. Vent til installasjonen er fullført, og Python vil være installert på Windows-maskinen din.

Alternativt:
- `choco install python312` - For å installere python versjon 3.12 med chocolatey
- `winget install -e --id Python.Python.3.11` - Fo å installere python versjon 3.11 med WinGet

### Mac:
1. Åpne Terminal-appen på Mac.
2. Sjekk om Homebrew er installert ved å kjøre kommandoen `brew --version`. Hvis du ikke har Homebrew, kan du installere det ved å følge instruksjonene på [Homebrews offisielle nettsted](https://brew.sh/) eller se seksjonen over.
3. Når Homebrew er installert, kan du installere Python ved å kjøre kommandoen `brew install python`.
4. Vent til installasjonen er fullført, og Python vil være installert på Mac-maskinen din.

### Linux:
1. Åpne Terminal-appen på Linux.
2. Sjekk om pakkebehandleren din støtter Python ved å kjøre kommandoen `apt-get --version` (for Debian/Ubuntu) eller `yum --version` (for Fedora/CentOS).
3. Hvis pakkebehandleren din støtter Python, kan du installere det ved å kjøre kommandoen `sudo apt-get install python` (for Debian/Ubuntu) eller `sudo yum install python` (for Fedora/CentOS).
4. Vent til installasjonen er fullført, og Python vil være installert på Linux-maskinen din.

Husk å sjekke at Python er riktig installert ved å kjøre kommandoen `python --version` i Terminalen. Du bør se versjonsnummeret til Python som er installert.

## Node
Node.js er en populær plattform for å kjøre JavaScript på serveren. Her er instruksjonene for å laste ned Node.js på Windows, Mac og Linux:

### Windows:
1. Gå til [Node.js nedlastingssiden](https://nodejs.org/en/download/) i nettleseren din.
2. Last ned den anbefalte LTS-versjonen for Windows ved å klikke på "LTS" knappen under "Prebuilt installer" fanen.
3. Åpne den nedlastede filen og følg instruksjonene i installasjonsveiviseren.
4. Godta lisensavtalen og velg installasjonsstedet.
5. Klikk på "Next" for å starte installasjonen.
6. Vent til installasjonen er fullført, og Node.js vil være installert på Windows-maskinen din.

Alternativt:
- `choco install nodejs-lts` - For å installere Node.JS LTS (Long Term Support) med chocolatey
- `winget install -e --id OpenJS.NodeJS.LTS` - For å installere Node.JS LTS (Long Term Support) med WinGet

### Mac:
1. Åpne Terminal-appen på Mac.
2. Sjekk om Homebrew er installert ved å kjøre kommandoen `brew --version`. Hvis du ikke har Homebrew, kan du installere det ved å følge instruksjonene på [Homebrews offisielle nettsted](https://brew.sh/).
3. Når Homebrew er installert, kan du installere Node.js ved å kjøre kommandoen `brew install node`.
4. Vent til installasjonen er fullført, og Node.js vil være installert på Mac-maskinen din.

### Linux:
1. Åpne Terminal-appen på Linux.
2. Sjekk om pakkebehandleren din støtter Node.js ved å kjøre kommandoen `apt-get --version` (for Debian/Ubuntu) eller `yum --version` (for Fedora/CentOS).
3. Hvis pakkebehandleren din støtter Node.js, kan du installere det ved å kjøre kommandoen `sudo apt-get install nodejs` (for Debian/Ubuntu) eller `sudo yum install nodejs` (for Fedora/CentOS).
4. Vent til installasjonen er fullført, og Node.js vil være installert på Linux-maskinen din.

Husk å sjekke at Node.js er riktig installert ved å kjøre kommandoen `node --version` i Terminalen. Du bør se versjonsnummeret til Node.js som er installert. Ved å laste ned node får du også en `npm` som er default pakkebehandler for å laste ned javascript biblioteker.

## PNPM
PNPM er en pakkehåndterer for JavaScript-prosjekter. Det er et alternativ til npm og yarn, og gir raskere og mer effektiv installasjon og administrasjon av pakker.

For å installere PNPM, følg instruksjonene nedenfor basert på ditt operativsystem:

### Windows:
1. Åpne Command Prompt eller PowerShell.
2. Kjør følgende kommando for å installere PNPM globalt:
    `npm install -g pnpm`

### Mac:
1. Åpne Terminal.
2. Kjør følgende kommando for å installere PNPM globalt:
    `npm install -g pnpm`

### Linux:
1. Åpne Terminal.
2. Kjør følgende kommando for å installere PNPM globalt:
    `npm install -g pnpm`

Etter å ha installert PNPM, kan du bruke det som en erstatning for npm eller yarn. PNPM vil automatisk oppdage og bruke den eksisterende package-lock.json- eller yarn.lock-filen i prosjektet ditt.
---
title: 'Installering'
---

For å kunne begynne å utvikle på Lepton, er det nødvendig med en del teknologier som må installeres. Docker gjør det lettere å få på plass alt man trenger. Dermed vil vi først gå gjennom hvordan man laster ned Docker og setter opp prosjektet.

## Docker

Veien for å laste ned Docker er forskjellig fra hvilket OS man benytter. Følgende lenker fungerer for å laste ned Docker Desktop:

- [Windows og Mac](https://www.docker.com/products/docker-desktop/)
- [Linux](https://docs.docker.com/desktop/install/linux-install/)

Etter at du har lastet ned Docker Desktop, vil det være et Docker Ikon (forutsatt at du har huket av for dette under installasjonen) på PC'en din. Når du åpner Docker Desktop, så er det ikke nødvendig å logge inn. Dokcer Desktop er en interface som skal gjøre det lettere for deg å se hvilke prosesser som kjører.

OBS! For at du skal kunne kjøre Docker kommandoer, for å kjøre Lepton API'et, må Docker kjøre i bakgrunnen. Dette gjør du ved å åpne Docker Dekstop. Du kan krysse ut Docker Dektop etter at du har åpnet det, så vil Docker kjøre i bakgrunnen.

## Git

For å kunne håndtere opplastning og nedlastning av prosjekter bruker vi git. Dette er et verktøy som gir oss versjonskontroll, som vil si at flere kan kode på sine egne versjoner av koden uten at det påvirker andre som også koder på prosjektet.

For å laste ned git kan du følge [git sin egen dokumentasjon](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). For macOS derimot kan det være lettere å laste ned [homebrew](https://docs.brew.sh/Installation), ved deretter å følge [denne fremgangsmåten](https://www.git-scm.com/download/mac).

### Installering med pakkebehandlere:

#### Windows

- Chocolatey: `choco install git`
- WinGet: `winget install -e --id Git.Git`

#### Linux/Mac

Git kommer som regel ferdig installert på Linux og MacOS, men om det av en eller annen grunn ikke er installert så kan du gjøre:

- Mac (Brew): `brew install git`
- Linux (Debian): `sudo apt install git-all`
- Linux (Fedora/CentOS): `sudo dnf install git-all`
- Linux (Arch): Trenger du egentlig hjelp om du bruker Arch???

## Python

Frem til nå har du lastet ned alt som er nødvendig for å kjøre Lepton. Det kan derimot være greit å laste ned python også. Ved å gjøre dette kan du laste ned pakker vi bruker i prosjektet, lokalt også. Dette gir fordelen av at man får hjelp til å finne funksjoner når man bruker eksterne pakker. Dermed trenger man ikke å huske alt i hodet og søke opp hele tiden.

Ved å følge [python sin dokumentasjon](https://www.python.org/downloads/), finner dere fremgangsmåte for å laste ned python. OBS! Det er viktig at python legges i PATH til systemet, slik at man kan kjøre python.

### Installering med pakkebehandlere:

#### Windows

- Chocolatey: `choco install python312`
- WinGet: `winget install -e --id Python.Python.3.11`

#### Linux/Mac

Git kommer som regel ferdig installert på Linux og MacOS, men om det av en eller annen grunn ikke er installert så kan du gjøre:

- Mac (Brew): `brew install python`
- Linux (Debian): `sudo apt install python`
- Linux (Fedora/CentOS): `sudo dnf install python`
- Linux (Arch): Trenger du egentlig hjelp om du bruker Arch???

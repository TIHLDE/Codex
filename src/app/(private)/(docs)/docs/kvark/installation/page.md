---
title: 'Installering'
---

Det å sette i gang med utvikling på Kvark er veldig enkelt, og krever kun noen få steg. Følg denne veivisningen punkt for punkt, og vipps så er du i gang!

## 1 - Installer nodejs og npm

Følg denne lenka, og last ned Nodejs LTS. Ved å laste ned Nodejs får man også automatisk npm med på kjøpet! [Last ned Nodejs og npm her](https://nodejs.org/en).

Når du har fullført installasjonsprosessen, kan du kontrollere at både Nodejs og npm fungerer ved å åpne terminalen, for så å skrive følgende kommandoer:

```bash
$ node --version
v20.11.0
```

```bash
$ npm --version
v10.2.4
```

Dersom du får en feilmelding når du skriver dette, kan du starte PCen din på nytt og deretter sjekke igjen.

## 2 - Installer pnpm

Som nevnt på introduksjonssida, erstatter vi npm med pnpm i Kvark. Det fine er at denne pakkebehandleren lett kan installeres gjennom npm! Dersom du har fullført det forrige steget, kan du skrive følgende kommando i terminalen:

```bash
$ npm install -g pnpm
added 1 package in 4s

1 package is looking for funding
  run `npm fund` for details
```

Nå kan du prøve følgende kommando for å kontrollere at pnpm er blitt installert:

```bash
$ pnpm --version
8.14.1
```

Dersom en feil oppstår, kan du forsøke å starte terminalvinduet på nytt, eller å starte hele PCen på nytt. Sjekk deretter om pnpm fungerer.

## 3 - Installer Git

For å kunne håndtere opplastning og nedlastning av prosjekter bruker vi git. Dette er et verktøy som gir oss versjonskontroll, som vil si at flere kan kode på sine egne versjoner av koden uten at det påvirker andre som også koder på prosjektet.

For å laste ned git kan du følge [git sin egen dokumentasjon](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). For macOS derimot kan det være lettere å laste ned [homebrew](https://docs.brew.sh/Installation), ved deretter å følge [denne fremgangsmåten](https://www.git-scm.com/download/mac).

## 4 - Last ned Kvark

Nå er det på tide å laste Kvark-kodebasen ned til PCen din! Det enkleste er å følge [denne fine veiledningen til GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository), som forklarer det i god detalj. Husk å finne fram riktig repository når du skal kopiere URL-en!

## 5 - Åpne kodebasen i et valgfritt kodeverktøy, installer avhengigheter med terminalen

Nå som koden er ferdig lasta ned, er det på tide å åpne den i et kodeverktøy av ditt valg. I tillegg trenger du å ha et terminalvindu åpent, med filplassering i mappa til Kvark. Etter det kan du kjøre følgende kommando

```bash
$\Documents\GitHub\Kvark:~$ pnpm install
```

## 6 - Legg inn .env-variabler

Nå som du har satt opp kodebasen, er det viktig at du kobler den opp mot enten utvikler-apiet til index, eller til den lokalt hostede backenden (Lepton). For å gjøre dette må du opprette en fil som heter `.env` i øverste mappe på prosjektet. Det som skal skrives inn her vil variere utifra hva du ønsker å oppnå:

### Koble til utivklerapiet til Index

```text
VITE_API_URL=https://api-dev.tihlde.org/
```

### Koble til lokalt hostet backend (Lepton)

```text
VITE_API_URL=http://localhost:8000/
```

### Koble til produksjonsapiet til Index

```text
VITE_API_URL=https://api.tihlde.org/
```

## 7 - Start opp frontendserveren

Nå er alt i boks, og du kan starte nettsida! For å gjøre dette, må du kjøre følgende kommanda i terminalen, og pass på at du er i riktig mappe:

```bash
$\Documents\GitHub\Kvark:~$ pnpm start
  VITE v5.0.0  ready in 2187 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://10.144.144.68:3000/
  ➜  Network: http://192.168.2.56:3000/
  ➜  press h + enter to show help
```

## Videre arbeid

Gratulerer! Du har nå satt opp frontenden til Tihlde, og du kan besøke den på [ http://localhost:3000/ ](http://localhost:3000/). Om du ønsker å bli endra bedre kjent med kodebasen, er det sterkt anbefalt å lese videre på dokumentasjonen slik at du får et solid grunnlag.

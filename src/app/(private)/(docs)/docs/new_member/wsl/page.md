---
title: 'WSL'
---

Mange bruker en PC som har Windows som operativsystem. Windows er laget for å gi brukeren et brukegrensesnitt for det meste. Dette gjør det lettere for deg som bruker å bruke din PC. Derimot er det andre ulemper som følger med dette. Et operativsystem som Linux gir deg som bruker flere muligheter ved hjelp av terminalen din.

## WSL
Heldigvis er det en veldig enkel måte å kjøre Linux på Windows. Ved å ta i bruk WSL (Windows Subsystem for Linux) har du mulighet til å ha en egen terminal for Linux, der du kan laste ned ulike versjoner av Linux (som Ubuntu og Rocky). I tillegg vil du ha tilgang til alle dine filer, slik at det er enkelt å koble sammen ditt Windows arbeidsområde med ditt Linux arbeidsområde.

## Nedlastning
Å laste ned WSL er veldig enkelt ved å laste ned fra [Microsoft Store](https://apps.microsoft.com/detail/9pdxgncfsczv?rtc=1&hl=nb-no&gl=NO). 

Etter at du har lastet ned WSL, så kan du sette din versjon til den nyeste, som er 2. Åpne CMD og skriv følgende:

```
wsl --set-default-version 2
```

## Last ned Linux Image
Ulike versjoner av Linux heter Image. Ved hjelp av WSL er det veldig enkelt å laste ned det du ønsker:

```
# Søk etter alle mulige Images
wsl --list --online

# Last ned et Image
wsl --install -d <distro>

# Eksempel for Ubunutu
wsl --install -d ubuntu
```

## Start et Image
For å starte opp et Image kan du åpne CMD og skrive følgende:

```
# Se alt du har tilgjengelig med versjon
wsl -l -v

# Start et Image
wsl -d <distro>

# Eksempel for å starte Ubuntu
wsl -d Ubuntu
```
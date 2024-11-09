---
title: Hvordan teste kode?
---

Når man lager et API, så gjør man det med ett formål: å sende data til bruker. I vårt tilfelle blir denne dataen visualisert for brukeren ved hjelp av Kvark. Din oppgave som backend utvikler er å gjøre API'et best mulig.

## Hvorfor tester vi kode?

Som medlem av Index så kommer du til å jobbed med prosjekter med et eller flere team. Som backend utvikler er din rolle å gjøre klar nødvendige endepunkt for frontend utviklerne. Du bestemmer deg for følgende taktikk:

1. Du koder et endepunkt.
2. Du sier ifra til frontend utvikleren at endepunktet er klart.
3. Frontend utvikleren finner feil, og sier ifra til deg.
4. Tilbake til steg 1.

Dette er tungvint i det lange løp, og krever mye tid og frustrasjon. Kanskje frontend utvikleren i tillegg ikke gir gode nok tilbakemeldinger så du ikke retter opp riktig feil, og så holder man på frem og tilbake.

Derfor tester vi koden vår. Vi tester koden etter et sett med scenariorer vi vet at endepunktene kommer til treffe. Vi tester både etter ting som vi vet skal skje riktig, og hva som kan skje feil. Tester som dette kan både være **integrasjonstester** og **enhetstester**.

Ved å teste koden vår kan vi på egenhånd finne ut hvilke feil vi har og hva som må rettes opp i før vi leverer endepunktene til frontend utvikleren. Det er så klart ikke alt vi kan test opp mot, siden vi ikke kan forutse alle mulige situasjoner, men de mest åpenbare scenarioene er det viktig at vi tester.

## Integrasjon vs enhet

Så det er to hovedområder innenfor testing som vi i Index fokuserer mest på når det kommer til Lepton. Det er **integrasjonstester** og **enhetstester**.

En **enhetsstest** er en test som tester en enkel funksjon. Dette kan være en funksjon som tester om vår matematiske funksjon gir riktig resultat:

```python
def add(a: int, b: int) -> int:
    return a + b
```

En enhetstest ville her testet om det vi får tilbake fra add() metoden faktisk er riktig resultat.

Årsaken til at vi driver med enhetstester er fordi noen endepunkter krever mye logikk. Ved å dele opp testene til å treffe hver sine områder er det lettere å finne ut hvor en feil ligger, og det er lettere å teste mulige scenarioer opp mot testen. Vi vet at Python ikke bryr seg om typer, så hva skjer hvis vi sender inn en streng i add() metoden istedenfor et heltall?

**Integrasjonsstester** derimot tester et helt endepunkt og hvilken respons vi får. En integrasjonsstest vil ikke test om vår add metode i seg selv gir riktig resultat eller ikke. Testen vil teste om hele endepunktet gir tilbake riktig responskode og data som vi forventer.

De fleste endepunkter i Lepton krever bare integrasjonsstester. Forklaringen er så enkel som at vi ikke skriver noe spesielt komplisert kode. Mye av funksjonaliteten som finnes på TIHLDE sine produkter er ganske basic funksjonalitet som du finner på de fleste nettsider og apper.

Derimot så er det flere eksempler på endepunkt vi har som krever mer logikk. Og da er det viktig å utføre enhetstester i tillegg.

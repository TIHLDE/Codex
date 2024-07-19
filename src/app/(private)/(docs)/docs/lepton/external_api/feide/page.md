---
title: 'Verifisering med Feide'
---

Når du oppretter en bruker hos TIHLDE så må du først registrere en bruker med gitt informasjon, og så må en fra HS eller Index godkjenne at din bruker faktisk tilhører et av studiene til TIHLDE.

Dette er en metode vi har benyttet oss av i flere år, men som vi anser som tungvint og lite tidseffektivt. Dermed har det vært et behov for å automatisere denne prosessen. Dette kan man gjøre ganske enkelt ved hjelp av [Feide sitt api](https://docs.feide.no/reference/apis/feide-api/index.html).

Siden vi kun ønsker å verifisere om brukeren tilhører et av TIHLDE sine studier, men ikke bruke det som innloggingsmetode, så er et oppsett av dette ganske fort gjort.

## Bruker har to valg
Vi ønsker å gi en bruker som ønsker å registere en bruker, to valg. Enten kan man opprette en bruker automatisk ved å logge seg inn med Feide, og så vil Lepton ta hånd om resten. Dette er det vi ønsker at brukere gjør. Men hva hvis det skjer en feil med innloggingen med Feide eller kanskje en ny student ikke har fått Feide konto enda? Dermed må vi fortsatt beholde vår gamle registreringsmetode.

## Hvordan bruke Feide som verifisering
Denne dokumentasjonen er basert på Feide sin egen dokumentasjon som du kan lese mer om [her](https://docs.feide.no/service_providers/openid_connect/feide_obtaining_tokens.html#registering-your-application). Hvis det skal utbedres til å integrere selv innloggingsprosessen med Feide, krever det en bedre kjennskap med dokumentasjonen til Feide.

Det første steget for å benytte seg av Feide, er å gi brukeren mulighet til å logge inn med Feide. Dette er en ganske enkel prosess, og ved å la bruker trykke på en knapp som sender brukeren til en lignende url:

```
https://auth.dataporten.no/oauth/authorization?
client_id=<our_feide_client_id>&
response_type=code&
redirect_uri=http://localhost:3000/ny-bruker/feide&
scope=openid&
state=whatever
```

Dette vil redirecte brukeren til Feide sin egen innloggingsside som du mest sannsynlig er kjent med.

![Feide innlogging](https://docs.feide.no/_images/enter_credentials_in_feide_login.png)

Etter at bruker har logget inn med riktig Feide brukernavn og passord, blir brukeren sendt tilbake til vår redirect_url:

```
HTTP/1.1 302 Found
Location: http://localhost:3000/ny-bruker/feide?
code=0f8cf5fa-dc3f-4c9d-a60c-b6016c4134fa&
state=f47282ec-0a8b-450a-b0da-dddb393fbeca
```

Her ser vi at **code** er en token som varer i 10 min (dette er maks tid, og er usikkert om Feide bruker denne tiden eller mindre).




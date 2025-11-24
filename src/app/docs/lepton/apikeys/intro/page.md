---
title: 'API nøkler'
---

Vi har utviklet et enkelt API-system som gjør det mulig å generere nye API-nøkler direkte fra Django Admin-panelet. Disse nøklene brukes for å autentisere forespørsler til API-et. API-nøkler er unike strenger som fungerer som en form for legitimasjon for å få tilgang til API-et. Vi har opprettet dette systemet slik at våre programmer kan utføre diverse operasjoner uten å være avhengig av en bruker sin innlogging.

For å bruke en API-nøkkel, må den inkluderes i forespørselens header som følger:

```curl
x-api-key: <din-api-nøkkel>
```

Dette sikrer at kun autoriserte brukere har tilgang til API-et.
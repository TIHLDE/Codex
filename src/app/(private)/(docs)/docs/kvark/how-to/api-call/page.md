---
title: 'API-kall'
---

API-kall er det som binder frontenden sammen med backend. Når eksempelvis brukerinformasjon, nyhetsartikler, arrangementer, spørreundersøkelser og grupper skal vises på nettsida vår, må den først gjøre et API-kall til backenden for å hente ut informasjonen som skal vises. Akkurat hvordan dette skjer skal vi ta for oss nå.

For å gjøre API-kall, kan vi ta i bruk koden som er definert i `api.tsx`-fila. Her finner vi mange funksjoner som håndterer innhentingen av data fra backend for deg, hvor URLen de går til for å hente dataen leses fra `.env`-fila som er blitt snakket om tidligere.

Dersom du leser dette, bør du allerede være til dels kjent med hvordan Javascript fungerer. For å gjøre et HTTP-kall, brukes gjerne `fetch`-funksjonen hvor man får tilbake en `promise`:

```javascript
fetch('http://localhost:8000')
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err))
  .finally(() => console.log('Finished handling response'));
```

Hvis du allerede har tatt en titt i `api.tsx`-fila, ser du at koden er veldig annerledes fra det som ble beskrevet ovenfor:

```javascript
getUserBio: (id: UserBio['id'] | null) => IFetch<UserBio>({ method: 'GET', url: `${BIO_ENDPOINT}${id}/` }
```

Dette kommer av en rekke forskjellige årsaker. Nå skal vi gå gjennom hva som bygger opp denne spørringen, og hvordan vi kan lage en helt egen funksjon som gjør det samme.

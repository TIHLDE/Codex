---
title: 'Caching av API-kall'
---

Caching er når man mellomlagrer data på enheten til brukeren, slik at man gjør færre spørringer mot backend. Det er en rekke fordeler med dette:

- **Færre spørringer mot backend** - Mindre belastning for backend, som også betyr lavere ressursbruk
- **Gjenbruking av data** - Data som sannsynligvis ikke har endret seg siden sist kan gjenbrukes
- **Kjappere innlasting** - Dette gir en bedre brukeropplevelse, ettersom at dataen kan lastes direkte fra minnet til enheten framfor å gjøre et tregt nettverkskall
- **Spare penger** - Med lavere ressursbruk i backend sparer Index og derfor også TIHLDE penger

Så hvordan gjør vi dette i Kvark?

{% callout title="Ikke fortvil 😰" %}
Caching er et kjent problem innenfor koding, og det kan ta lang tid å mestre. Denne introduksjonen er bare ment til å få deg i gang, ettersom at den beste måten å lære dette på er ved å prøve å feile, i tillegg til å søke deg litt opp på nettet.
{% /callout %}

## useQuery

For en hook som tar i bruk `useQuery` framfor `useMutation`, trenger man bare å lage en cache-nøkkel som all dataen lagres på. Disse cache-nøklene kan defineres på toppen av hook-fila di som en `const`. Man kan dessuten kombinere flere nøkler, slik at man får bedre granularitet når det kommer til å oppdatere deler av cachen ved en senere anledning.

Her er et eksempel på hvordan vi kan bruke cache-nøkler for å hente ut en bruker med en bruker-id:

```javascript
export const USER_QUERY_KEY = 'user';

export const useUser = (userId?: User['user_id'], options?: UseQueryOptions<User | undefined, RequestResponse, User | undefined, QueryKey>) => {
  const isAuthenticated = useIsAuthenticated();
  const logOut = useLogout();
  return useQuery<User | undefined, RequestResponse>([➡️USER_QUERY_KEY⬅️, userId], () => (isAuthenticated ? API.getUserData(userId) : undefined), {
    [...]
  }}
```

I dette eksempelet har vi kombinert en konstant cache-nøkkel med en brukerid, og dette lar oss invalidere spesifikke brukere i cachen gjennom `queryClient`.

## Invalidering

Så hva betyr egentlig invalidering? Kort sagt, betyr det å kaste ut visse data fra cachen, for så å hente inn nye fra backend. Dersom jeg ønsker å invalidere en spesifikk bruker, må jeg bruke en funksjon fra `queryClient` til å invalidere følgende tags: `[USER_QUERY_KEY, <brukerid>]`. Målet med invalidering (også kjent som revalidering) er å oppdatere data som er blitt ugyldig. Dette gjøres for eksempel dersom man oppdaterer noe på brukeren sin. Da er det nødvendig å oppdatere cachen, slik at nettsida gjenspeiler endringene.

## Tilbake til queryClient

For å invalidere spesifikke cache-nøkler, må man ta i bruk `queryClient`-en. Vi tar fram eksempelet fra forrige side:

```javascript
export const useCreateEvent = (): UseMutationResult<Event, RequestResponse, EventMutate, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((newEvent: EventMutate) => API.createEvent(newEvent), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(EVENT_QUERY_KEYS.all);
      queryClient.setQueryData(EVENT_QUERY_KEYS.detail(data.id), data);
    },
  });
};
```

Som man kan se, tar vi i bruk `useQueryClient`-hooken inne i vår egendefinerte `useCreateEvent`-hook. `onSuccess`-funksjonen tar i bruk denne klienten for å gjøre to ting:

1. Invalidere alle arrangementer (`queryClient.invalidateQueries(EVENT_QUERY_KEYS.all)`).
2. Sette den detaljerte informasjonen for ett enkelt arrangement til dataen som returneres fra backend.

I dette tilfellet er cache-nøkkelen definert på en mer kompleks måte, og dette skal vi ikke se på nå. Dersom du er nysgjerrig finnes den på toppen av `/src/hooks/Event.tsx`-fila i Kvark.

Det som skjer i punkt 1. har større ringvirkninger enn det denne enkle kodebiten får det til å se ut til. Det har seg nemlig slik at hooken for å hente ut alle arrangementer vil oppdage at cachen dens er blitt invalidert, og den vil som en følge automatisk sende en spørring til backend om å hente ny data. I dette tilfellet er den nye dataen en liste over alle arrangementer.

queryClient brukes altså i hovedsak til to ting: manuelt oppdatere cachen med ny data, og å invalidere cache-nøkler slik at ny data automatisk hentes inn.

## Videre lesing

Dersom du fortsatt sitter igjen med en del spørsmål, anbefales det å ta en titt rundt på YouTube.

- [Fireship: React Query](https://www.youtube.com/watch?v=novnyCaa7To&ab_channel=Fireship)
- [Web Dev Simplified: React Query](https://youtu.be/r8Dg0KVnfMA?si=LhT5p9q6fgjk1fKc)

(Den siste videoen er veldig lang, og er ikke påkrevd å se gjennom. Den er mest tiltenkt spesielt interesserte!)

---
title: 'Bruke en API-funksjon (GET)'
---

Denne siden tar for seg å bruke en API-funksjon for å **_hente_** data. For å se hvordan man **_sender_** data og **_utfører endringer på dataen_** til backend, [gå til neste side](/docs/kvark/how-to/api-call/use-mutation).

Nå som API-funksjonen er blitt laget, må vi bruke den på en hensiktsmessig måte. Her kommer `react-query` inn i bildet, som lar oss håndtere datainnhenting, caching og revalidering på en praktisk måte. Vi kommer til å gi funksjonen vi har laget som et argument til biblioteket, og så vil det meste skje automatisk.

{% callout title="Pro tip" %}
React query kan være veldig innvikla. Dersom du er usikker på noe, anbefales det sterkt å ta en titt på den [offisielle dokumentasjonen fra tanstack](https://tanstack.com/query/v3/docs/framework/react/overview).
{% /callout %}

## Case study

La oss ta for oss et eksempel fra kodebasen vår. Koden som vises nedenfor kommer fra en komponent som inneholder profilsida.

`src\pages\Profile\index.tsx`

```javascript
const Profile = () => {
  const { userId } = useParams();
  const { data: user, isError } = useUser(userId);
```

På den nederste linja ser vi at vi bruker en funksjon som heter `useUser`. Problemet her er at API-funksjonen som henter brukerdataen fra backend ser slik ut (hentet fra `api.tsx`):

```javascript
getUserData: (userId?: User['user_id']) => IFetch<User>({ method: 'GET', url: `${USERS_ENDPOINT}/${userId || ME_ENDPOINT}/` })
```

Som du ser, er det ikke denne vi kaller direkte på når vi skal hente brukerdataen. Vi bruker faktisk den funksjonen som heter `useUser`. Det er her `react-query` kommer inn i bildet.

useUser er en **hook** som wrapper en funksjon fra `react-query`. Dersom vi tar en titt på definisjonen til `useUser`, ser vi at den er hjemmelaga (den stammer altså ikke fra noe bibliotek), og at den bruker en funksjon ved navn `useQuery`:

```javascript
export const useUser = (userId?: User['user_id'], options?: UseQueryOptions<User | undefined, RequestResponse, User | undefined, QueryKey>) => {
  const isAuthenticated = useIsAuthenticated();
  const logOut = useLogout();
  return useQuery<User | undefined, RequestResponse>([USER_QUERY_KEY, userId], () => (isAuthenticated ? API.getUserData(userId) : undefined), {
[...]
```

useQuery er importert fra `react-query`, og det er denne funksjonen som kommer til å håndtere caching, revalidering og fetching for oss. Som du kan se gir vi `API.getUserData(userId)` som et argument til `useQuery`, og dette betyr at `useQuery` skal bruke denne funksjonen for å gjøre API-kallene.

## Hva betyr alt dette?

Vi kan se for oss at spørringen opp mot backend har fire steg som kommer etter hverandre:

1. Bruk en hook i komponenten som håndterer spørringen (for eksempel `useUser()`)
2. Hooken bruker `react-query`, som håndterer reaktivitet, caching, fetching og revalidering. I tillegg gis den egendefinerte API-funksjonen som et argument til `react-query`
3. Den hjemmelagede funksjonen (definert i `api.tsx`) definerer argumentene som tas inn i spørringen. Dessuten bestemmer den hvilket HTTP-verb spørringen skal ha. Funksjonen bruker `IFetch` for å sende avgårde forespørselen til backend.
4. IFetch wrapper den innebygde `fetch`-funksjonen i Nodejs. På denne måten kan det automatisk legges til authentication tokens, filer og dataobjekter, samt at en returtype kan defineres ved hjelp av IFetch sine generics. Det er herifra selve forespørselen sendes ut, og når den kommer tilbake vil svaret "bubble" oppover igjen (dvs. gå fra steg 4 til 1 baklengs).

## Hvordan en hook brukes i en komponent

Nå er det på tide å ta API-hooken vi har laget i bruk! La oss se på et eksempel fra en eksisterende komponent.

### Case Study

`/src/hooks/Event.ts`

```javascript
export const useEventById = (eventId: Event['id']) =>
  useQuery<Event, RequestResponse>(EVENT_QUERY_KEYS.detail(eventId), () => API.getEvent(eventId), { enabled: eventId !== -1 });
```

`/src/pages/EventDetails/index.tsx`

```javascript
const EventDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useEventById(Number(id));
```

Dette er kode som er hentet fra siden for å vise et detaljert arrangement. Som vi kan se, tas `useEventById`-hooken i bruk, og vi gir den en id (som er id-en til arrangementet). Det som vil skje umiddelbart etter at hooken lastes inn og kjøres er følgende:

- useEventById sender et HTTP-kall til backenden med IFetch-metoden. Variablene vi har destrukturert - `data`, `isLoading` og `isError` vil ha initialverdier som følger

  - `isLoading` er `true`
  - `data` er `undefined`
  - `isError` er `false`

- Etter en stund vil vi få et svar fra backend. Da vil de destrukturerte verdiene se slik ut:
  - `isLoading` er `false`
  - `data` har typen som ble satt i genericen til useQuery i `/src/hooks/Event.ts` (fra det første eksempelet i dette delkapittelet `useQuery<➡️Event⬅️, RequestResponse>([...])`). Dersom det har oppstått en feil, vil `data` være undefined.
  - `isError` er enten `true` eller `false`, avhengig om det har oppstått en feil under innhentingen.

`useEventById`-hooken eksporterer også en rekke andre variabler som vi kan hente ut ([bilde](/images/useQueryvalues.png)). Vi kan for eksempel skrive følgende dersom vi ønsker å ta i bruk noen av de andre variablene som eksporteres fra `useEventById`:

```javascript
const { data, isLoading, isError, isSuccess, refetch } = useEventById(
  Number(id),
);
```

Nå skal vi bevege oss videre ned i `/src/pages/EventDetails/index.tsx`-fila for å se hvordan de ulike variablene brukes.

```tsx
<div>
  <div>
    {isLoading ? (
      <EventRendererLoading />
    ) : (
      data !== undefined && <EventRenderer data={data} />
    )}
  </div>
</div>
```

Her kan vi se hvordan de ulike variablene fra `useEventById` blir tatt i bruk, og det er overraskende enkelt! Alle variablene er **reaktive**, og derfor vil det som vises på nettsida automatisk oppdateres dersom de endrer verdi etter at komponenten først ble vist.

For å konkretisere, så gjør koden følgende:

- Dersom `isLoading` er `true`, vis `<EventRendererLoading />`. Denne vises altså midlertidig fram til dataen er hentet fra backend.
- Dersom `isLoading` er `false` og `data` ikke er `undefined`, vis `<EventRenderer data={data} />` og send inn den innhentede dataen fra backend gjennom `data`-proppen.

Hvis props fortsatt ikke er et kjent konsept, er det viktig å aller først få en [grunnleggende forståelse for **React**](/docs/kvark/examples/react).

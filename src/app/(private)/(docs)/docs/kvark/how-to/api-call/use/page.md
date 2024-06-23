---
title: 'Bruke en API-funksjon'
---

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

WIP

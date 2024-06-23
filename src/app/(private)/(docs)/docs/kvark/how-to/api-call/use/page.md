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

Som du ser, er det ikke denne vi kaller direkte på når vi skal hente brukerdataen. Vi bruker faktisk en helt annen funksjon som heter `useUser`. Det er her `react-query` kommer inn i bildet.

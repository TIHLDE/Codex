---
title: 'Bruke en API-funksjon (POST/PUT/PATCH/DELETE)'
---

Denne siden tar for seg å bruke en API-funksjon for å **_sende_** data og **_utføre endringer på dataen_** til backend. For å se hvordan man **_henter_** data, [gå til forrige side](/docs/kvark/how-to/api-call/use-query). Denne siden bygger videre på det som ble snakket om på forrige side, så hvis noe virker uklart kan det være lurt å gå tilbake for å [lese den først](/docs/kvark/how-to/api-call/use-query).

Det er mange fellestrekk mellom å sende og å spørre etter data fra backend med React Query. Hovedforskjellen er at man bytter ut `useQuery` med `useMutation`, og dette gjør også at vi får en rekke nye variabler vi kan destrukturere fra hooken vår. La oss sammenligne de to funksjonene:

**Hente data**

```javascript
export const useEventById = (eventId: Event['id']) =>
  useQuery<Event, RequestResponse>(EVENT_QUERY_KEYS.detail(eventId), () => API.getEvent(eventId), { enabled: eventId !== -1 });
```

**Sende data**

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

Selv om det er en del mer kode i det siste eksempelet hvor vi sender data til backend (oppretter et arrangement), skjer mye av det samme. Nå skal vi ta for oss bit for bit, slik at vi kan danne en forståelse for hvordan det funker.

## useMutation

`useMutation` gjør mye av det samme som `useQuery`, med hovedforskjell at den tilbyr funksjoner for å sende data til backend on-demand gjennom en funksjon. Dersom vi destrukturerer det som returneres fra `useMutation`, får vi blant annet følgende variabler:

- mutate (funksjon)
- data
- isError
- isLoading

### mutate()

Det er mutate-funksjonen som lar oss sende data til backend. Det finnes også en annen variant av mutate ved navn `mutateAsync`. Denne fungerer på samme måte, bare at den returnerer en promise som vi kan velge å håndtere etter behov. Den er med andre ord asynkron.

I koden nedenfor sender vi et HTTP-kall til backenden ved å bruke `mutate()`. Se om du klarer å forstå hvordan det henger sammen! `someClickHandler` er navnet på en vilkårlig funksjon som kalles dersom brukeren ønsker å lagre det nye arrangementet, eksempelvis ved å trykke på en knapp.

```javascript
const { mutate } = useCreateEvent();

const someClickHandler = () => {
  mutate(
    event /*<= Definert et annet sted, inneholder informasjon om arrangementet som opprettes*/,
    {
      onSuccess: (newEvent) => {
        toast.success('Arrangementet ble opprettet');
        goToEvent(newEvent.id);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    },
  );
};
```

Utenom mutate-funksjonen, er mye likt mellom `useQuery`- og `useMutation`-funksjonene. Det anbefales å eksperimentere litt, og å sjekke den [offisielle dokumentasjonen](https://tanstack.com/query/v3/docs/framework/react/reference/useMutation) for å lære mer!

### onSuccess()

`onSuccess` er funksjonen som kalles på når HTTP-requesten er vellykka. Her kan man legge inn kode som skal kjøres ved et slikt tilfelle.

### queryClient

`queryClient` er et verktøy får å få programmatisk tilgang til cache, queries og mutations. Dersom du studerer kodeeksempelet ovenfor, kan det hende du skjønner hva det brukes til. Hvis ikke går det helt fint! På den neste siden skal vi ta for oss hvordan caching fungerer, og hva vi gjør i Kvark for å ta i bruk dette viktige konseptet.

## Et kjent eksempel

Nå skal vi knytte denne nye kunnskapen opp mot eksempelet vi tok for oss på siden for å [Lage en API-funksjon (GET/POST)](/docs/kvark/how-to/api-call/create). Som du forhåpentligvis husker, lagde vi en `postUser`-funksjon, som tok i bruk `IFetch` for å poste data til backend. Selv om vi brukte HTTP-verbet `POST` i denne funksjonen, kan vi også bytte det ut med `DELETE`, `PUT` eller `PATCH`, alt ettersom hva vi ønsker å oppnå. Vi kommer til å gi denne `postUser`-funksjonen til `useMutation`, og det er viktig å påpeke at alle disse HTTP-verbene (`DELETE`, `PUT` og `PATCH`) kan brukes i dette tilfellet. Med andre ord så brukes `useMutation` for alle tilfeller der man ønsker å **slette**, **oppdatere** eller **opprette** data i backend.

Nedenfor er den kjente `postUser`-funksjonen, som hører hjemme i `api.tsx`-fila

```javascript
const dataObject = {
    key: 'attribute'
    anotherKey: 'anotherAttribute'
    /* [...] */
}

export const postUser = (data) => IFetch<User>({method: 'POST', url: `${ USER_ENDPOINT }/`, data});
```

Nå skal vi knytte denne opp mot en hook som bruker `useMutation`

```javascript
export const useCreateUser = (): UseMutationResult<User, RequestResponse, UserFormData, unknown> => {
    return useMutation((newUser: UserFormData) => API.postUser(newUser), {
        onSuccess: (data) => {
            // Handle caching (We will handle this another time)
        }
    })
}
```

Nå kan vi bruke dene hooken i en komponent!

```tsx
const UserForm = () => {
    const form = useForm<UserFormData>();
    const createUser = useCreateUser();

    const submitUser = () => {
        if (!form.values) return; // Alternatively show an error if the user has not been defined in the form
        createUser.mutate(user, {
            onSuccess: () => {
                // Handle the success! Maybe redirect the user?
            },
            onError: () => {
                // Something went wrong. Inform the user!
            }
        })
    }

    return (
        {/* Some form stuff */}
        <button onClick={submitUser}>Opprett bruker</button>
    )
}
```

Dette er et litt kunstig eksempel, men forhåpentligvis har du lært noe nytt!

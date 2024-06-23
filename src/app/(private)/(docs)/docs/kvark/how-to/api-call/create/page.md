---
title: 'Lage en API-funksjon'
---

Når du skal lage en ny API-funksjon, er det viktig å forstå hvordan det skal bygges opp. [ Som tidligere nevnt ser dette ikke ut som når man bruker en vanlig fetch-funksjon ](/docs/kvark/how-to/api-call), og hvorfor dette er tilfellet skal vi ta for oss nå.

## IFetch<T>

`IFetch` fungerer som en hjemmelaget wrapper for `fetch`-funksjonen. Den tar i tillegg inn en generic (**<T>**), som bestemmer returtypen for svaret fra backend.

Videre gjør IFetch følgende:

- Utfører spørringen med et gitt HTTP-verb, som oppgis i `method`-argumentet
- Legger til en authentication token dersom `withAuth` er `true`. Dette er standardverdien dersom ikke noe annet oppgis. En authentication token autentiserer brukeren opp mot backenden slik at de kan hente ut beskyttede data. På denne måten kan man også kontrollere at brukeren har riktige privelegier før de kan utføre CRUD-operasjoner opp mot databasen.
- Legger ved JSON-data i spørringen gjennom `data`-argumentet.
- Henter backend-URL fra `.env`-fila, og sender spørringen dit.
- Legger ved filer i spørringen med `file`-argumentet.

Innerst i `IFetch`-funksjonen ligger det et kall til `fetch`. Med andre ord, så er det en wrapper som tilbyr tillegstjenester utover det `fetch` kan gjøre på egenhånd.

## IFetch-genericen

Som nevnt tar IFetch inn en generic. Dette er veldig kjekt for å opprettholde typesikkerhet, selv når man mottar svar fra backend. Under følger et eksempel på hvordan man kan ta den i bruk:

```javascript
type User = {
    username: string,
    birthYear: number,
    firstName: string,
    lastName: string
}

const getUser = (username: string) => IFetch<User>({method: 'GET', url: '<some_url>'});

getUser("olanordmann").then(res => {
   console.log( res.firstName );
        // => Ola
})
```

Det man ikke kan se i dette eksempelet er hvordan Intellisense gir autocomplete-forslag. Når du prøver dette selv, vil du observere at dersom man skriver `res.` på den 11. linja, vises de ulike attributtene på objektet (`username`, `birthYear`, `firstName`, `lastName`).

## IFetch-argumenter

Utenom genericen, tar IFetch inn en rekke argumenter. Nedenfor vises funksjonssignaturen, slik at du kan se alle mulighetene til IFetch.

```javascript
export const IFetch = <T extends unknown>({ method, url, data = {}, withAuth = true, file }: FetchProps): Promise<T> => {
```

Som du kan se, har vi følgende argumenter:

- method - `GET`, `POST`, `PUT`, `DELETE`
- url - URL-en som legges på etter BASE_URL definert i `.env`
- data - Javascript-objekt som gjøres om til et JSON-objekt når det sendes avgårde til backend. Dette er selve innholdet til forespørselen dersom noe skal postes til backend.
- withAuth - `true`, `false`. Bestemmer om authentication token skal legges med i forespørselen. Dette gir tilgang til beskyttede ressurser.
- file - `File`, `File[]`, `Blob`. Dersom en fil skal legges ved i forespørselen, gjøres det her. Man kan også legge ved en liste med filer.

Disse er altså sterkt knyttet til IFetch sine egenskaper, [som ble nevnt ovenfor](/docs/kvark/how-to/api-call/create#i-fetch-t).

### URL

URL-en skal defineres på toppen av `api.tsx`-fila, og eksporteres slik at den kan brukes andre steder. Her er et eksempel på hvordan det allerede ser ut:

```javascript
[...]
export const NEWS_ENDPOINT = 'news';
export const NOTIFICATIONS_ENDPOINT = 'notifications';
export const NOTIFICATION_SETTINGS_ENDPOINT = 'notification-settings';
export const WIKI_ENDPOINT = 'pages';
export const SHORT_LINKS_ENDPOINT = 'short-links';
[...]
```

Det vi vil er at du også følger denne konvensjonen når du legger inn nye endepunkter.

Når det er gjort, kan det enkelt brukes i API-funksjonen du har laget:

```javascript
export const USER_ENDPOINT = "user"

[...]

type User = {
    username: string,
    birthYear: number,
    firstName: string,
    lastName: string
}

const getUser = (username: string) => IFetch<User>({method: 'GET', url: `${ USER_ENDPOINT }/` });
getUser("olanordmann").then(res => {
   console.log( res.firstName );
        // => Ola
})
```

### Data

`data`-argumentet kan enkelt legges inn på spørringer med passende HTTP-verb (`POST`, `PUT`). Dette er et Javascript-objekt, og kan eksempelvis se slik ut:

```javascript
const dataObject = {
    key: 'attribute'
    anotherKey: 'anotherAttribute'
    /* [...] */
}

const postUser = (data) => IFetch<User>({method: 'POST', url: `${ USER_ENDPOINT }/`, data});

postUser(dataObject).then(res => {
    // Some code
})
```

## Avslutningsvis

For å oppsummere, har vi laget to ulike API-funksjoner; én som henter ut data, og én som sender avgårde data til backend:

```javascript
export const USER_ENDPOINT = "user"

[...]

type User = {
    username: string,
    birthYear: number,
    firstName: string,
    lastName: string
}

const getUser = (username: string) => IFetch<User>({method: 'GET', url: `${ USER_ENDPOINT }/` });
getUser("olanordmann").then(res => {
   console.log( res.firstName );
        // => Ola
})
```

```javascript
const dataObject = {
    key: 'attribute'
    anotherKey: 'anotherAttribute'
    /* [...] */
}

const postUser = (data) => IFetch<User>({method: 'POST', url: `${ USER_ENDPOINT }/`, data});

postUser(dataObject).then(res => {
    // Some code
})
```

Du veit nå hvordan man skal lage nye API-funkjoner! Neste steg er å ta de i bruk.

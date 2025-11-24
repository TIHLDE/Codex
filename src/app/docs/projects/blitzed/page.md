---
title: Blitzed
---

Blitzed er en fullstack nettside designet for mobiler, som lar TIHLDE-medlemmer arrangere- og spille drikkeleker.

Per i dag jobbes det med beer pong turneringer og 100 spørsmål, men siden er åpen for å legge til flere drikkeleker.

## Tech stack

Prosjektet er bygd med [NextJS](https://nextjs.org/), og benytter [tRPC](https://trpc.io/) som API-rammeverk. Dette betyr at både backend og frontend ligger i samme prosjekt, som gjør det enklere å bygge full-stack løsninger.

## Hvordan kjøre prosjektet?

### 1. Start med å klone prosjektet med

```bash
git clone git@github.com:TIHLDE/Blitzed.git
```

### 2. Installer alle pakker

Vi bruker [PNPM](https://pnpm.io/) for å håndtere [NodeJS](https://nodejs.org/en) pakker.

```bash
pnpm i
```

Denne kommandoen er kort for `pnpm install`, og installerer alle pakker spesifisert i `package.json`

### 3. Sett opp en Postgres-database

Vi benytter [PostgreSQL](https://www.postgresql.org/) som database, siden denne er rask, sikker og relasjonell.

Databasen kjøres gjennom [Docker](https://www.docker.com/), som gjør det enklere å sette opp utviklingsmiljøer lokalt.

Gå inn [her](https://www.docker.com/get-started/) for å installere og sette opp Docker på din PC.

Når Docker kjører i bakgrunnen, kan du kjøre `docker compose up -d ` fra roten av prosjektet, som starter opp en database på din PC.

Dette kjører `compose.yml`-filen som ligger i roten av prosjektet, som spesifiserer instillinger for å sette opp en database på din PC.

### 4. Sett opp miljøvariabler

Miljøvariabler er "instillinger" for prosjektet vårt, som bestemmer hvilken database prosjektet skal bruke, hvem som kan være administratorer osv...

Det ligger en fil som heter `.env-example` i roten av prosjektet, som du kan kopiere. Kall kopien din `.env`. Du kan fritt justere på instillingene som ligger der etter ønske. Du merker sikkert at `.env`-filen din blir grå. Dette er fordi filnavnet ligger i `.gitignore`.

[GIT](https://git-scm.com/) ignorerer alle filer som ligger i denne, slik at hemmelig informasjon ikke blir versjonskontrollert. Det er sykt viktig at man ikke pusher hemmelig data, da dette kan være en sikkerhetsrisiko (i tillegg til at man får bot hahah).

### 5. Kjør prosjektet

Alle stegene beskrevet ovenfor trenger du bare å gjøre én gang. Etter det kan prosjektet kjøres med:

```bash
pnpm dev
```

Dette starter opp NextJS med tRPC-serveren, og du kan nå gå til `http://localhost:3000` for å se nettsiden.

## Filstruktur på backenden

[tRPC](https://trpc.io/) fungerer litt annerledes enn [REST](https://en.wikipedia.org/wiki/REST). Man bruker ikke url-er eller HTTP metoder som GET/PUT/POST for å gjøre ting.

Istedet er alle endepunkter bare funksjoner kallt "procedures" som man kan kalle på.

Prosedyrer kan organiseres i "routers" for å strukturere prosjektet. "Root-router"-en finner man i `/src/server/api/root.ts`, og inneholder alle prosedyrene til backenden.

{% figure src="/images/blitzed-trpc-structure.png" alt="blitzed backend filstruktur" caption="Struktur på tRPC endepunkter" %}
{% /figure %}

## tRPC

Det finnes to typer tRPC procedures, query og mutation.

En query er en prosedyre som **henter ut** data. En mutation er en prosedyre som **ender/sender** data.

### Mutation

I bildet ovenfor ser du at vi har en prosedyre for å bli med i et beer pong lag, med navn `join` på `team`-routeren.

Vi kan bruke dette endepunktet i frontenden:

```typescript
'use client';

// merk at vi importerer fra "react"
import { api } from '../../../trpc/react';

...

const { mutateAsync: joinTeam } = api.beerPong.team.join.useMutation();

const joinATeam = async () => {
  await joinTeam({
    teamId: 2,
    tournamentId: 'tournament id',
  });
};
```

### Query

For å hente data ut, har vi to muligheter. Hvis du skal lage en siden som bare viser fram noe informasjon fra databasen, er det lurt å bruke [server-side rendering](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering). Dette gjør at serveren henter ut informasjonen, produserer en side med det, og sender HTML til klienten.

### Server-side

Fordelen er at hele siden blir "cached", ([caching](https://nextjs.org/docs/app/building-your-application/caching)), og det er lettere å skrive kode på denne måten. Det kan være lurt å lese seg opp på SSR med NextJS.

Vi kan for eksempel bruke `get`-prosedyren på `tournament`-routeren for å hente ut en turnering.

`/beer-pong/[id]/page.tsx`:

```typescript
// merk at vi importerer fra "server"
import { api } from "../../../trpc/server";

import BeforePage from "./before";
import ActivePage from "./ongoing";
import ResultsPage from "./results";

export default async function TournamentPage({
  params,
}: {
  params: { id: string };
}) {
  const tournament = await api.beerPong.tournament.get({ id: params.id });

  if (tournament.status === "CREATED") {
    return <BeforePage tournament={tournament} />;
  } else if (tournament.status === "ACTIVE") {
    return <ActivePage tournament={tournament} />;
  }

  return <ResultsPage tournament={tournament} />;
}
```

Her bruker vi `id` fra NextJS [route parameters](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes) for å hente ut en id fra url-en. F.eks. "localhost:3000/beer-pong/bruh" gir `params.id = "bruh"`.

Vi kan da bare hente ut turneringen og bruke denne for å vise fram siden.

### Client-side

Av og til lønner det seg å hente ut data på klient-siden. Hvis du lager en side der du ønsker å endre på dataen ofte, og ønsker å holde informasjonen på skjermen oppdatert etter hver gang du gjør endringer, kan det være lurt å bruke data-henting på klienten.

```typescript
'use client';

import { useEffect } from 'react';
// merk at vi importerer fra "react"
import { api } from '../../../trpc/react';

export default function ClientPage() {
  const { data: tournament } = api.beerPong.tournament.get.useQuery(
    {
      id: 'tournament id',
    },
    { refetchInterval: 3_000 },
  );

  useEffect(() => {
    console.log('Turneringen endret på seg!');
  }, [tournament]);
}
```

Dette eksempelet viser en komponent som henter ut en turnering hvert 3. sekund, og bruker `console.log` for å printe ut til konsollen hver gang `tournament` endrer på seg.

Lær mer om hvordan du bruker queries og mutations på client-side med [Tanstack query](https://tanstack.com/query/latest). Vi bruker Tanstack for å kjøre alle client-side prosedyre-operasjoner. Du kan også lese mer om oppsettet på [T3-stack](https://create.t3.gg/en/usage/trpc).

## Hvordan lage en prosedyre

Enhver prosedyre består av en base-prosedyre, input-skjema, output-skjema og en kontroller.

| Norsk          | Kode           | Betydning                                                                            |
| -------------- | -------------- | ------------------------------------------------------------------------------------ |
| base-prosedyre | base procedure | En funksjon man bygger videre på, som også bestemmer hvem som kan benytte prosedyren |
| input-skjema   | input schema   | Regler for hva klienten må sende til serveren                                        |
| output-skjema  | output schema  | Regler for hva serveren må sende tilbake til klienten                                |
| kontroller     | controller     | Funksjon som håndterer prosedyre-kallet                                              |

Nå skal vi lage en ny prosedyre som henter ut beer-pong laget en bruker er i, for en gitt turnering.

Her er filstrukturen på router-en som for lag (teams):

```bash
src/server/api/beer-pong/team
├── controller
│   ├── create.ts
│   ├── destroy.ts
│   └── join.ts
└── router.ts
```

### 1. lag en ny fil som heter `get-joined` i `controller`-mappen.

Når filen er opprettet, er det på tide å sette opp de 4 delene som beskrevet i tabellen ovenfor.
Hvis du bruker VsCode, kan du skrive `con` i filen. Da kommer det opp en `snippet` som du kan ekspandere. Dette gjør det lett å sette opp kontrollere, slik at alle får samme struktur i filen, som er lettere å holde styr på.

Du kan også bare lime inn følgende:

```typescript
import { Controller } from '~/server/api/trpc';

import { db } from '~/server/db';
import { z } from 'zod';
import { protectedProcedure } from '~/server/api/trpc';

const InputSchema = z.object({});

const OutputSchema = z.object({});

const handler: Controller<
  z.infer<typeof InputSchema>,
  z.infer<typeof OutputSchema>
> = async ({ input, ctx }) => {};

export default protectedProcedure
  .input(InputSchema)
  .output(OutputSchema)
  .query(handler);
```

### 2. Bruk riktig base-prosedyre

Nederst setter vi sammen alle de 4 delene. Vi starter med en `protected` base-prosedyre. Denne gjør at man må være logget inn for å bruke prosedyren. Du kan også bruke `publicProcedure`, slik at alle kan bruke den, eller `adminProcedure` slik at kun admins kan benytte prosedyren.

### 3. Input-skjema

Siden prosedyren vi lager skal hente ut alle lag brukeren er med på for en gitt turnering, trenger vi id-en til turneringen.

Vi ber derfor klienten sende oss en `tournamentId` som vi kan bruke, ved å endre på InputSchema:

```typescript
const InputSchema = z.object({
  tournamentId: z.string().cuid(),
});
```

Siden turneringer benytter `cuid` som ID i databasen, validerer vi at det er det klienten sender til oss med [zod validation](https://zod.dev/).

### 4. Output-skjema

Dersom brukeren ikke er med i noe lag, ønsker vi å sende tilbake `null`. Ellers sender vi navnet og ID-en til laget tilbake til klienten.

```typescript
const OutputSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
  })
  .nullable();
```

### 5. Kontroller

Til slutt skriver vi selve logikken til kontrolleren. Vi kan hente ut brukerens id med `ctx.session.user.id`. Du finner også andre nyttige felter i `ctx`-objektet.

```typescript
const handler: Controller<
  z.infer<typeof InputSchema>,
  z.infer<typeof OutputSchema>
> = async ({ input, ctx }) => {
  const joinedTeam = await db.beerPongTeam.findFirst({
    where: {
      tournamentId: input.tournamentId,
      members: {
        some: {
          userId: ctx.session.user.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!joinedTeam) {
    return null;
  }

  return {
    id: joinedTeam.id,
    name: joinedTeam.name,
  };
};
```

Her henter vi ut første beer-pong lag som tilhører turneringen, og som har brukeren i sine medlemmer. Vi "select"-er ID-en og navnet på laget som oppfyller kravene.

### 6. Router

Nå som prosedyren er ferdig, går vi inn i `router.ts` for å registrere prosedyren.

```typescript
import getJoined from './controller/get-joined';

export const teamRouter = createTRPCRouter({
  // ...
  getJoined,
});
```

🎉 Gratulerer! Du lagde nettopp din første tRPC-prosedyre 🎉

For å teste den i frontenden, lag en ny side, og legg inn følgende kode:

```typescript
import { api } from "../../trpc/server";

export default async function MyTeamsPage() {
  const myTeam = await api.beerPong.team.getJoined({
    tournamentId: "turnerings-id",
  });

  if (!myTeam) {
    return <div>Du er ikke med på et lag </div>;
  }

  return (
    <div>
      Lagnavn: {myTeam.id}, id: {myTeam.id}
    </div>
  );
}
```

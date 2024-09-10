---
title: 'Introduksjon'
---

Kvark er frontendkodebasen for TIHLDE-nettsida, som du sikkert allerede har tatt i bruk flere ganger ([tihlde.org](https://tihlde.org)). Kvark benytter seg i hovedsak av følgende teknologier:

- Vite
- React
- Shadcn
- Typescript
- Nodejs
- Pnpm
- Vercel
- React query
- React router

## Vite

Vite er et moderne byggeverktøy som tilbyr raskere oppstartstid og hot module replacement (HMR), noe som forbedrer utvikleropplevelsen ved å automatisk laste inn endringer i kildekoden uten at man trenger å laste inn hele sida på nytt. Den benytter seg av native ES Modules, som gjør den raskere enn tradisjonelle bundlere som Webpack. Mye av dette er fancy tech-lingo som ikke har noe å si for deg som skal kode på nettsida, men det er likevel greit å ha i bakhodet.

## React

React er et frontend-rammeverk for å bygge brukergrensesnitt. Det lar oss lage komponentbaserte applikasjoner, noe som gjør koden mer modulær og gjenbrukbar. Reacts virtuelle DOM gir bedre ytelse ved å minimere kostbare DOM-manipulasjoner. Å bruke React er ganske annerledes fra å skrive vanlig Javascript, HTML og CSS, men det er virkelig verdt å mestre dette. Det finnes mange grunner, deriblant at vi i all hovedsak bruker dette i Index, men også fordi det er det mest populære rammeverket, som tilbyr et enormt økosystem med utvidelser.

## Shad/cn

Shadcn er en løsning bestående av ferdigimplementerte komponenter, som lett kan stiliseres med tailwind. Ved å ta i bruk [shadcn/ui](https://ui.shadcn.com/) kan man manuelt legge til enkelte komponenter, som automatisk tar i bruk fargepalettet som er definert i kodebasen. Dessuten kan man endre på kildekoden til disse så mye man vil, som legger til rette for at de kan være helt spesiallagde.

## Typescript

Typescript er i bunn og grunn en videreutvikling av Javascript, der man har tatt inspirasjon fra typede språk som Java ved å legge til typedeklarasjoner i koden. Nedenfor sammenligner vi Javascript opp mot Typescript.

```javascript
const user = {
  name: 'Ola Nordmann',
  age: 69,
  address: 'Høgskoleparken 1',
  livesByOcean: false,
};

console.log(user.name);
// => Ola Nordmann
```

```typescript
type User = {
  name: string;
  age: number;
  address: string;
  livesByOcean?: boolean; // <-- Spørsmålstegnet betyr at verdien er valgfri.
};

const user: User = {
  name: 'Ola Nordmann',
  age: 69,
  address: 'Høgskoleparken 1',
  // livesByOcean: false <-- Siden vi har definert denne verdien som valgfri, trenger vi ikke å definere den i objektet.
};

console.log(user.name);
// => Ola Nordmann
```

Typescript er en mye brukt teknologi (både i arbeidslivet og på hjemmesnekra prosjekter) som gjør det enklere å produsere bugfri og stabil kode. Dette er en av de mange grunnene til at det brukes i Index, og derfor er det sterkt oppfordra å bli kjent med dette. En fin ressurs [er typescript sin dokumentasjonsside](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html).

## Nodejs

Nodejs er det underliggende verktøyet som gjør det mulig å kjøre javascriptkoden (som kompileres fra typescript) på egen maskin utenfor nettleseren. Dersom man har prøvd å dobbelttrykke på en javascript-fil før, har man sett at fila ikke kan kjøres. Det er dette nodejs tar seg av, slik at man kan kjøre disse scriptene på maskinen. I tillegg har Nodejs et enormt økosystem av pakker som kan løse alle slags problemer. Disse hentes inn via **pnpm**.

## Pnpm

Pnpm er en pakkebehandler som håndterer enkel innhenting av pakker via kommandolinja. Dette er en raskere og mer stabil versjon av npm. Pakkene hentes inn via `package.json`-fila som ligger på rotnivået av prosjektet.

## Vercel

Vercel er en plattform for frontend-hosting som gjør det enkelt å distribuere moderne webapplikasjoner. Det tilbyr automatisk skalering, innebygd caching og støtte for serverløse funksjoner, noe som gjør det ideelt for å hoste React-applikasjoner som Kvark. I bunn og grunn er dette en mellommann mellom oss og AWS.

## React query (nå kjent som Tanstack Query)

React Query er et datalastingsbibliotek for React som håndterer serverstate på en effektiv måte. Det gir oss funksjoner som caching, synkronisering med backend (serveren) og bakgrunnsoppdateringer, noe som forbedrer brukeropplevelsen ved å gjøre datahåndteringen mer sømløs.

## React router

React Router er et bibliotek for klient-side ruting i React-applikasjoner. Det lar oss definere ruter i applikasjonen vår, slik at vi kan navigere mellom ulike sider uten å laste siden på nytt. Dette bidrar til en mer dynamisk og responsiv brukeropplevelse. Større sider som YouTube bruker lignende teknologier for å tilby tjenestene sine.

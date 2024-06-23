---
title: 'Innføring i React'
---

React er et veldig fleksibelt og givende rammeverk å arbeide med. Målet med denne siden er å gi deg en rekke verktøy og ressurser som kan tas i bruk for å bli godt kjent med denne nye måten å se på frontendteknologier på. Dessuten håper vi at det åpner en helt ny verden med muligheter for deg som skal lage TIHLDEs fremtidige brukergrensesnitter!

## Lage en ny komponent

Når man skal lage en ny komponent, er det viktig å plassere den i en hensiktsmessig mappe. Dersom det er en komponent som er spesifikt laget for en enkelt side, kan den plasseres i komponentmappa til sida. Her er et eksempel fra kodebasen:

Hovedsida (https://tihlde.org/) har en kalender for å vise arrangementer. Ettersom at denne ikke brukes noen andre steder (og sannsynligvis heller ikke kommer til å bli det i framtida), kan den trygt plasseres i komponentmappa til siden (`/src/pages/Landing/components/EventsView.tsx`)

Dersom en mer generell komponent skal lages, som i prinsippet kan brukes overalt (eksempelvis en filopplastningskomponent) kan denne plasseres i `/src/components/Upload.tsx`.

Med andre ord - velg en filplassering med omhu slik at det blir lett å forstå og vedlikeholde komponenten ved et seinere tidspunkt.

Men nå er det på tide å lage en ny komponent, og denne skal vise en stor tekst som kan ha et vilkårlig innhold. Dessuten ønsker vi at denne teksten skal ha en rød bakgrunn.

```javascript
const CoolTitle = () => {};
```

Vi begynner med å definere en funksjon. Denne måten å definere en funksjon kan se litt ukjent ut, men i prinsippet er det det samme som å skrive

```javascript
function CoolTitle() {}
```

Dette vil bli komponenten vår, og vi ønsker å eksportere denne slik at den blir tilgjengelig utenfor fila vår:

```javascript
export const CoolTitle = () => {};
```

Det er inne i krøllparentesene at vi kommer til å definere selve HTML-en og CSSen (med tailwind). For å gjøre dette må vi returnere det ut av funksjonen:

```javascript
export const CoolTitle = () => {
    return (
        // Her skal noe returneres, men vi vet ikke hva ennå
    )
}
```

Nå, la oss putte inn noe html slik at vi får en overskrift.

```javascript
export const CoolTitle = () => {
  return <h1>Dette er en kul overskrift</h1>;
};
```

Deretter kan vi legge til stiler med tailwind:

```javascript
export const CoolTitle = () => {
  return (
    <h1 className="rounded-lg bg-red-500 p-5">Dette er en kul overskrift</h1>
  );
};
```

(Ikke tenk så mye på tailwind akkurat nå, dette kommer vi til seinere)

For å bruke denne komponenten i en annen fil må vi først importere den, og deretter bruke den som en hvilken som helst annen HTML-tag:

```javascript
import { CoolTitle } from "..." // <= Placeholder path

export const PageWithCoolStuff = () => {
    return (
        [...] // Some random content
        <CoolTitle />
        [...] // More arbitrary content
    )
}
```

### Men vi har et problem!

Hva hvis vi ønsker å vise noe annet enn "Dette er en kul overskrift"? Akkurat nå lar ikke komponenten oss endre på teksten, selv om vi definerer en selvvalgt tekst mellom taggene:

```javascript
import { CoolTitle } from "..." // <= Placeholder path

export const PageWithCoolStuff = () => {
    return (
        [...] // Some random content
        <CoolTitle>Dette er en annen kul tekst!</CoolTitle>
        [...] // More arbitrary content
    )
}
```

For å fikse dette må vi ta i bruk et grunnleggende prinsipp i React - props. Dette er en måte å sende data fra en foreldrekomponent, ned til barnekomponenten. I dette tilfellet ønsker vi å sende "Dette er en annen kul tekst!" fra foreldrekomponenten (`PageWithCoolStuff`) ned til barnekomponenten (`CoolTitle`).

Dette gjøres på følgende måte:

```javascript
export const CoolTitle = ({ ...props }) => {
  return <h1 className="rounded-lg bg-red-500 p-5" {...props} />;
};
```

Videre må vi ta i bruk typescript, og da ender koden opp med å se slik ut:

```javascript
export const CoolTitle = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  return <h1 className="rounded-lg bg-red-500 p-5" {...props} />;
};
```

I tillegg må vi ta i bruk prinsippene for **SOLID**, og dette gir følgende kode:

```javascript
export const CoolTitle = ({ className, ...props }: React.HTMLProps<HTMLDivElement>) => {
  return <h1 className={cn("rounded-lg bg-red-500 p-5", className)} {...props} />;
};
```

Frykt ikke - du kommer til å få en rekke ressurser på bunnen av denne sida som forklarer akkurat hva alt dette betyr.

## Videre lesing

Når som du har fått en helt grunnleggende forståelse for React, vil du henvises videre til utvalgte læringskilder som gir deg den kunnskapen du trenger for å komme i gang!

- [Innføring i HTML](https://www.w3schools.com/html/)
- [Videre innføring i React](https://react.dev/learn)
- [SOLID i React](https://www.youtube.com/watch?v=MSq_DCRxOxw&ab_channel=CoderOne)
- [Innføring i CSS fra mdn web docs](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [tailwindcss sin dokumentasjonsside](https://tailwindcss.com/) (Denne er fin for å finne tailwindklasser som tilsvarer den CSSen du er ute etter)
- [cn-funksjon med tailwind](https://www.youtube.com/watch?v=re2JFITR7TI&t=112s&ab_channel=ByteGrad)
- [Innføring i Typescript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

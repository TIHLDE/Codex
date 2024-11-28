---
title: Kom i gang
---

{% quick-links %}

{% quick-link title="Lepton" icon="installation" href="/docs/lepton" description="Backend og API for Kvark" /%}

{% quick-link title="Kvark" icon="presets" href="/docs/kvark/introduction" description="Frontenden til TIHLDEs nettside" /%}

{% /quick-links %}

---

## Intro

{% callout title="TLDR" %}
Dokumentasjonssider ligger i `src/app/docs` mappen. Bruk filene `src/app/templates` for å komme
i gang med nye sider. Husk å oppdatere `src/app/lib/navigation.ts` med linker!
{% /callout %}

Dette prosjektet er bygget med [Nextjs](https://nextjs.org/), et React server-side rammeverk og
[Markdoc](https://markdoc.dev/), en markdown dokumentasjonsmalingsmotor.
Prosjektet er hostet på [Vercel](https://vercel.com/), skaperne av Nextjs.

Grunnen til at vi bruker Markdoc er for å kunne skrive dokumentasjon i markdown og ha det
rendret som et statisk nettsted, samtidig som vi kan bruke React-komponenter i markdown-filene.
Dette lar oss skrive dokumenter raskt, tilpasse nettstedet, forhåndsvise komponenter og
innebygde lenker.

Utover det følger alle markdown-filer vanlig Markdown-syntaks. Vennligst konsulter
[Markdoc-dokumentasjonen](https://markdoc.dev/docs) for mer informasjon.

## Prosjektstruktur

Hvis du kun planlegger å skrive dokumentasjon, kan du åpne mappen `src/app/docs` og
begynne å skrive markdown `(.md)`-filer. Følg eksempelvis hvordan andre sider er skrevet. Sørg for
at du lenker filene til navigasjonsmenyen ved å legge inn en lenke i `app/lib/navigation.ts`.

Hvis du planlegger å bidra til prosjektet, bør du lese de følgende seksjonene.

### Sider

Dette er hvor dokumentasjonen blir skrevet. Sidene er skrevet i markdown og blir rendret
som statiske sider. Resten av prosjektet går til utforming av nettsiden og kompilering av
markdown-filene til statisk html.

### Komponenter

Dette er React-komponentene som brukes i markdown-filene. De brukes både som nettsidekomponenter og
visse markdown-komponenter. For eksempel kan `callout`-komponenten brukes i markdown og blir senere

{% callout title="Callout" %}
Slik ser "callout" komponenten ut, som du kan bruke i din dokumentasjon. Det finnes flere slike
komponenter, bare å utforske!.
{% /callout %}

Det finnes allerede flere komponenter du kan bruke, men dersom du ønsker å lage din egen så
sjekk ut [Markdoc-dokumentasjonen](https://markdoc.dev/docs/tags) for mer informasjon.

### Markdoc

I mappen `src/app/markdoc` ligger alt av nodes og tags som brukes for å manipulere
markdown-filene. Noder brukes for å "style" markdownen, som for eksempel kodeblokker:

```javascript
console.log('Jeg er en kodeblokk!');
```

Tagger derimot lar oss bygge egne komponenter som "Callout" komponenten ovenfor. Da wrapper du
bare teksten din med curly brace og prosent. (Kan ikke skrives som eksempel her da, ellers
får vi en feilmelding ...)

## Markdown-side

Hver markdown-fil har en metadataseksjon på toppen, som brukes til å generere siden. Denne
delen er skrevet i YAML, og blir tolket av Markdoc-motoren. Bruk alltid `title` feltet, slik at
vi får generert en tittel til siden din.
_Eksempel_

```yaml
---
title: Min dokumentasjonsside
---
```

Det var alt du trengte for å starte, god progging!

{% quiz questions=[
  {
    "question": "Hva står REST for?",
    "answerIdx": 1,
    "answers": [
      "Restful state transport",
      "Representational state transfer",
      "Bruh moment",
      "Restless Brotherman Testern"
    ]
  },
  {
    "question": "Hva står REST for?",
    "answerIdx": 1,
    "answers": [
      "Restful state transport",
      "Representational state transfer",
      "Restless Brotherman Testern"
    ]
  },
] /%}
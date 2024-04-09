---
title: Kom i gang
---

{% quick-links %}

{% quick-link title="Lepton" icon="installation" href="/" description="Step-by-step guides to setting up your system and installing the library." /%}

{% quick-link title="Kvark" icon="presets" href="/" description="Learn how the internals work and contribute." /%}

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
console.log('Jeg er en kodeblokk!')
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

### Api-sider

Vi har laget en løsning for å dokumentere API-sider, som krever en litt annerledes utforming av
markdown siden din. Følge metadata skal inkluderes:

```yaml
---
title: 'Endpoint title'
description: 'Enpoint description'
method: METHOD
url: v1/your/endpoint
response_codes:
  - '201 Created'
  - '401 Unauthorized'
  - '599 Another code'
requires_auth: true # not required
permissions: # also not required
  - 'permission1'
  - 'permission2'
---
```

Du kan fjerne `permission` feletet dersom endepunktet ikke krever noen scropes, men behold
`requires_auth` feltet dersom endepunktet krever at brukeren er logget inn.

{% callout title="Pro tip" %}
Du finner templates for de mest vanlige bruksområdene i `app/templates` mappen :)
{% /callout %}

Det var alt du trengte for å starte, god progging!

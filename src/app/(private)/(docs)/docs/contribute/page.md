---
title: Kontribuere
---

## Introduction

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

**Eksempel:**

### Komponenter

Dette er React-komponentene som brukes i markdown-filene. De brukes både som nettsidekomponenter og visse markdown-komponenter. For eksempel kan `callout`-komponenten brukes i markdown og blir senere oversatt til html gjennom den respektive komponenten. Disse blir referert til som tags av Markdoc-motoren.

Det er noen få steg for å lage en slik komponent, vennligst se [Markdoc-dokumentasjonen](https://markdoc.dev/docs/tags) for mer informasjon.

### Markdoc

Filer relatert til Markdoc, som delvis sider (injisering av innhold i en side), og
deklarasjoner for egendefinerte tags og noder. En node konverterer markdown til markdown, mens en tag
skaper en React-komponent fra markdown.

`markdoc/partials/api_base`-filen brukes til å rendre den øverste delen av API-sidene, som
tillater en fin refaktorering. Denne delen bruker `markdoc/tags/api_props`-taggen for å rendre innholdet, som er generert fra metadataen på toppen av alle API-sider.

### Offentlig

Statisk filer, som ikoner, bilder og stilark lagres her. Disse brukes kun av
Nextjs for å rendre komponenter.

## Markdown-side

Hver markdown-fil har en metadataseksjon på toppen, som brukes til å generere siden. Denne
delen er skrevet i YAML, og blir tolket av Markdoc-motoren. Bruk alltid `title` og
`description`-feltene, da disse brukes til å lage sidetittelen og metabeskrivelsen.
_For example, the following metadata is used to generate this page:_

```yaml
---
title: Contributing
description: How to contribute
---
```

**Available props:**

```yaml
---
title: string
description: string
version: string
# For API pages (fields will not be shown without api_base partial)
method: string
url: string
response_codes: string[]
requires_auth: boolean # optional
permissions: string[] # optional
---
```

### Api page

The API pages have a few extra fields in the metadata section, which are used to generate the
endpoint's information bit. Following are the fields used in the metadata section:

```yaml
---
title: 'Endpoint title'
description: 'Does some fancy magic using Rust macros'
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

You can omit the `permission` field, but keep the `requires_auth` field if the endpoint requires
the user to be authenticated, but not have any special scopes.

Response code colors are automatically generated based on the response code, and are as follows:

```javascript
if (code.startsWith('2')) {
  return 'green'
} else {
  return 'red'
}
```

_(idk if it's worth making it more sophisticated...)_

### Api partial

The API partial is used to generate the top section of the API pages. It uses the metadata from
the frontmatter to generate the information bit. The partial is located in `markdoc/partials/api_base`.

To use this partial, you need to add the following to the top of your markdown file:
Note that the `file` path is absolute and does not need to be changed.

```markdown
(% partial file="api_base.md" / %)

# replace parentheses with curly braces

(I can't write it here because it will be rendered)
```

Well, that's all for ya! Happy coding!

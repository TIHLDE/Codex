# Azure Resources og RG

I Azure organiseres alt i et hierarki, og for å få oversikt og kontroll på prosjektene våre er det viktig å forstå dette grunnleggende oppsettet. Hierarkiet består av **Management Groups → Subscriptions → Resource Groups → Resources**, der hvert nivå bygger videre på det forrige.

## Management Groups – organisering på tvers av subscriptions

**Management Groups** ligger over subscriptions i hierarkiet og brukes til å samle flere subscriptions under én felles struktur. Dette gjør det mulig å styre **policyer, tilgang og kostnadsstyring** på tvers av prosjekter eller avdelinger. For større organisasjoner gir management groups et helhetlig kontrollnivå – for eksempel kan man ha én gruppe for produksjon og én for utvikling, med ulike regler og rettigheter. I mindre miljøer brukes de ofte til å legge felles **governance** og sikkerhetskrav på toppen av alle subscriptions.

## Subscription – øverste nivå

Øverst i Azure-strukturen finner vi **subscription**, som fungerer som ramme for både fakturering og lisenser. En organisasjon kan ha flere subscriptions for å skille kostnader, miljøer eller ansvarsområder, men alle ressurser må alltid knyttes til én bestemt subscription. Dette gjør det enkelt å fordele utgifter og administrere tilgang på et overordnet nivå.

## Resource Group – prosjektmappe

Innenfor en subscription organiseres tjenestene i **Resource Groups (RG)**. En RG fungerer som en prosjektmappe som samler alle ressursene som hører til samme løsning – for eksempel en webapp, en database og en storage account. På denne måten kan du administrere, overvåke og slette alle tilhørende ressurser samlet, noe som gir god orden og enkel opprydding når prosjektet avsluttes.

## Resources – byggesteinene

Til slutt har vi **resources**, som er de faktiske tjenestene vi bruker og setter sammen i Azure. Dette er alt fra App Services og databaser til virtuelle nettverk og lagringskontoer. Ressursene er byggesteinene i løsningen din, og det er gjennom dem du faktisk skaper funksjonaliteten i systemet.

## Location – hvor ressursene lagres

Locations er ikke en del av hierarki til Azure, men er greit å kjenne til.
Når vi oppretter en RG, må vi også velge en **location**. Dette er den fysiske regionen der metadataene til ressursene lagres, og regionvalget påvirker pris, ytelse og hvor dataene faktisk ligger. Vi går mer i dybden på regioner senere i læringsløpet, men det viktigste nå er å vite at dette må settes når du lager en RG, og at vi i TIHLDE standardiserer på *Norway East*.

## Best practice – struktur og navngivning

En ryddig struktur i Azure gjør det langt enklere å administrere ressurser. Dersom du oppretter én RG per prosjekt og miljø, for eksempel én for utvikling og én for produksjon, blir det tydelig hvilke ressurser som hører sammen. Navnekonvensjoner er også avgjørende – et godt mønster er å la alle resource groups starte med rg- fulgt av prosjekt og miljø, slik som rg-tihlde-web-dev. Når vi kombinerer dette med konsekvent tagging, får vi både oversikt i portalen, bedre grunnlag for kostnadsstyring og en enkel måte å holde orden på ressursene våre.
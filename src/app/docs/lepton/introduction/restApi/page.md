---
title: 'Hva er REST API?'
---

Et REST API, som står for Representational State Transfer Application Programming Interface, er et sett med retningslinjer og prinsipper for å utforme nettjenester som er enkle, skalerbare og fleksible. Vi benytter REST API til å utføre HTTP-protokollen for kommunikasjon og er basert på CRUD forespørsler.

- C: Create (opprett): Operasjon for å opprette instanser i databasen. Returnerer statuskode 201 hvis operasjonen er vellykket. Type Forespørsel: POST
- R: Read (les): Operasjon for å lese instanser i databasen. Her kan man enten få returnert en liste med instanser, eller en enkelt instans. Returnerer statuskode 200 hvis operasjonen er vellykket. Type Forespørsel: GET
- U: Update (oppdater): Operasjon for å oppdatere en instans i databasen. Returnerer statuskode 200 hvis operasjonen er vellykket. Type Forespørsel: PUT
- D: Delete (slett): Operasjon for å slette en instans i databasen. Returnerer statuskode 200 hvis operasjonen er vellykket. Type Forespørsel: DELETE

Alle operasjoner returnerer statuskode 500 hvis det har skjedd en feil i backend, eller 400 hvis det er mangler ved forespørselen. Dette kan for eksempel være at en POST forespørsel har glemt å sende med data som er nødvendig for å opprette en instans.

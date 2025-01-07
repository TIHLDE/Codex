---
title: 'Introduksjon'
---

Lepton benytter seg av flere typer teknologier for å kunne fungere. Du kan lese mer om dette i vår [introduksjon her](/docs/projects/lepton). Denne seksjonen derimot vil hovedsaklig fokusere på rammeverket Django.

## Hva er Django?
Django er et høy-nivå web-rammeverk som er skrevet i Python. Det gjør det mulig å utvikle sikre og vedlikeholdbare webapplikasjoner raskt og effektivt. Django følger prinsippet om "batteries included", noe som betyr at det kommer med mange innebygde funksjoner og verktøy som forenkler utviklingsprosessen. Eksempler på funksjoner og verktøy som følger med Django inkluderer:

- **Admin-grensesnitt**: Django kommer med et innebygd administrasjonsgrensesnitt som gjør det enkelt å administrere data fra databasen vår.
- **Autentisering**: Django har et robust autentiseringssystem som håndterer brukerpålogging, registrering og tillatelser.
- **ORM (Object-Relational Mapping)**: Django's ORM lar deg samhandle med databasen ved hjelp av Python-kode i stedet for SQL.
- **Sikkerhet**: Django inkluderer mange sikkerhetsfunksjoner som beskytter mot vanlige angrep som SQL-injeksjon, XSS og CSRF.

Disse funksjonene og verktøyene gjør Django til et kraftig og fleksibelt rammeverk for webutvikling.

## Django som et REST API
I tillegg til å være et fullverdig web-rammeverk, kan Django også brukes til å lage RESTful API-er. REST (Representational State Transfer) er en arkitekturstil for å designe nettverksbaserte applikasjoner. RESTful API-er bruker HTTP-protokollen for å utføre operasjoner på dataressurser. Django REST Framework (DRF) er et bibliotek som bygger videre på Django for å lage RESTful API-er. DRF gir mange funksjoner og verktøy som gjør det enkelt å lage API-er, inkludert:

- **Serializers**: Serializers konverterer komplekse datatyper som modeller og spørringssett til JSON-data som kan sendes over nettverket.
- **Viewsets og Routers**: Viewsets og Routers gjør det enkelt å definere API-endepunkter og URL-ruter.
- **Autentisering og Tillatelser**: DRF har innebygde verktøy for autentisering og tillatelser som gjør det enkelt å beskytte API-ene våre.

## Vår dokumentasjon
I denne dokumentasjonen vil vi utforske hvordan vi bruker Django og DRF til å lage RESTful API-er for Lepton. Vi vil dekke emner som:

- **Modeller og Spørringssett**: Hvordan vi bruker modeller og spørringssett (ORM) til å samhandle med databasen vår.
- **Serializers**: Hvordan vi bruker serializers til å konvertere data mellom Python-objekter og JSON-data.
- **Viewsets og Routers**: Hvordan vi bruker viewsets og routers til å definere API-endepunkter og URL-ruter.
- **Autentisering og Tillatelser**: Hvordan vi bruker autentisering og tillatelser til å beskytte API-ene våre.
- **Testing**: Hvordan vi tester API-ene våre for å sikre at de fungerer som forventet.
- **Feilhåndtering**: Hvordan vi håndterer feil og unntak i API-ene våre.
- **Dokumentasjon**: Hvordan vi dokumenterer API-ene våre for å gjøre det enklere for andre utviklere å bruke dem.
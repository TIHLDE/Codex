---
title: 'Opplastning av filer'
---

Dette endepunktet lar deg laste opp filer til Azure ved hjelp av en API-nøkkel. Endepunktet kan nås på følgende URL:

```
/apikeys/upload/
```

## Krav til forespørsel

For å bruke dette endepunktet må du inkludere følgende i forespørselen:

- **Header**: `x-api-key` må inneholde din API-nøkkel.
- **Body**: 
    - `FILES`: Selve filen som skal lastes opp.
    - `container_name`: Navnet på mappen (containeren) hvor filen skal lagres. Hvis mappen ikke eksisterer, vil den bli opprettet automatisk.

## Eksempel på forespørsel

```http
POST /apikeys/upload/ HTTP/1.1
Host: api.tihlde.org
x-api-key: din-api-nøkkel
Content-Type: multipart/form-data

FILES: [din_fil]
container_name: "min-mappe"
```

## Viktig

Husk å alltid inkludere API-nøkkelen i `x-api-key`-headeren for å autentisere forespørselen. Uten denne nøkkelen vil forespørselen bli avvist.
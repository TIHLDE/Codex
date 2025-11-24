---
title: 'Sende e-poster'
---

Dette endepunktet lar deg sende e-poster ved hjelp av en API-nøkkel. Endepunktet kan nås på følgende URL:

```
/apikeys/email/
```

## Krav til forespørsel

For å bruke dette endepunktet må du inkludere følgende i forespørselen:

- **Header**: `x-api-key` må inneholde din API-nøkkel.
- **Body**: 
    - `emails`: En liste over e-postadressene som skal motta e-posten.
    - `notification_type`: Typen notifikasjon, for eksempel `UTLEGG`.
    - `title`: Tittelen på e-posten.
    - `paragraphs`: En liste med avsnitt som skal inkluderes i e-posten.
    - **Valgfritt**:
        - `buttons`: En liste med knapper som inneholder `text` og `link`.
        - `attachments`: En liste med URL-er til vedlegg som skal inkluderes i e-posten.

## Eksempel på forespørsel

```http
POST /apikeys/email/ HTTP/1.1
Host: api.tihlde.org
x-api-key: din-api-nøkkel
Content-Type: application/json

{
    "emails": [
        "madsnyl@gmail.com"
    ],
    "notification_type": "UTLEGG",
    "title": "Utlegg sendt inn",
    "paragraphs": [
        "Mitt første avsnitt",
        "Mitt andre avsnitt"
    ],
    "buttons": [
        {
            "text": "Se TIHLDE",
            "link": "/test"
        }
    ],
    "attachments": [
        "https://tihldestorage.blob.core.windows.net/utlegg/my-image.png",
        "https://tihldestorage.blob.core.windows.net/utlegg/my-pdf.pdf"
    ]
}
```

## Viktig

Husk å alltid inkludere API-nøkkelen i `x-api-key`-headeren for å autentisere forespørselen. Uten denne nøkkelen vil forespørselen bli avvist.
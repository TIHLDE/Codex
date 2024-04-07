---
title: "Tittel på endepunktet"
description: "Beskrivelse av endepunktet"
method: GET
url: v1/ditt/endepunkt
response_codes:
  - "201 Created"
  - "401 Unauthorized"
  - "599 Another code"
# Om brukeren må være logget inn for å bruke endepunktet
requires_auth: true
# scopes som kreves for å bruke endepunktet
# bør fjernes hvis det ikke skal brukes, eller endepunktet ikke krever autentisering
permissions: 
  - "permission1"
  - "permission2"
---

*{% $markdoc.frontmatter.description %}*
{% api_props props=$markdoc.frontmatter %}

## Forespørsel
```json
{
  "name": "Mads Nylund",
  "description": "Grov kar"
}
```

## Respons
### 201 Created
```json
{
  "response": "Enig"
}
```

### 401 Unauthorized
```json
{
  "reason": "Bro hva skjer her?"
}
```

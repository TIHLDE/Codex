_sist oppdatert: 2025-10-30 av Borgar_

# Virtuell Maskin? More like virtuell heroin

---

## Hva er en virtuell maskin?

En virtuell maskin (VM) er en virtuell/digital versjon av en fysisk datamaskin. I stedet for å ha en fysisk server som står i et serverrom, får man en "simulert" datamaskin som kjører på NTNU sin infrastruktur.

En VM fungerer nøyaktig som en vanlig datamaskin:

- Den har sitt eget operativsystem (f.eks. Debian, Ubuntu, Windows)
- Den har tildelt CPU, RAM og disk-lagring
- Den har sitt eget nettverk og IP-adresse
- Du kan SSH-e inn på den og installere programmer akkurat som på en vanlig server

Det som skiller en VM fra en fysisk maskin er at flere VM-er kan kjøre på samme fysiske maskin samtidig. NTNU sin infrastruktur deler opp de fysiske ressursene mellom mange VM-er.

## Hvorfor bruker vi virtuelle maskiner?

TIHLDE har fått tildelt digitale ressurser på **OpenStack** fra NTNU som vi kan bruke til å lage VM-er. Dette er ressursene vi har tilgjengelig for å drive våre tjenester og nettsider.

### Separasjon av tjenester

I stedet for å kjøre alle tjenestene våre på én VM, deler vi dem opp på flere forskjellige VM-er. For eksempel:

- **Adelie** - hosting av småtjenester (Codex, Blitzed, Utlegg, Sporty, etc.)
- **Royal** - hosting av Vaultwarden (passord-manager)
- **Chinstrap** - proxy som ruter trafikk til riktige VM-er

Dette gir oss bedre oversikt, sikkerhet og stabilitet.

## Fordeler med virtuelle maskiner

### 1. Isolasjon og sikkerhet

Hver VM er fullstendig isolert fra andre VM-er. Hvis én tjeneste krasjer eller får et sikkerhetsproblem, påvirker det ikke de andre tjenestene.

**Eksempel:** Hvis Vaultwarden på Royal skulle kræsje hardt og smertefullt, er ikke småtjenestene på Adelie i fare.

### 2. Enklere administrasjon

Hver VM har sitt eget ansvarsområde, noe som gjør det lettere å:

- Forstå hva som kjører hvor
- Feilsøke problemer
- Oppdatere tjenester uten å påvirke andre
- Skrive dokumentasjon (som denne! ChatGPT hjelper også veldig)

### 3. Fleksibilitet

Vi kan enkelt:

- Lage nye VM-er for nye tjenester
- Slette VM-er vi ikke trenger lenger
- Endre størrelsen på VM-er (mer CPU, RAM, disk) etter behov
- Ta backup av individuelle VM-er

### 4. Ressursutnyttelse

NTNU sin OpenStack-plattform deler automatisk de fysiske ressursene mellom alle VM-ene. Dette betyr at vi kan:

- Ha flere VM-er enn om vi hadde måttet kjøpe fysiske servere
- Skalere opp/ned etter behov
- Ikke bekymre oss om fysisk vedlikehold av servere

{% callout title="Våre ressurser" type="note" %}
TIHLDE har fått tildelt digitale ressurser (CPU, RAM, disk) fra NTNU via OpenStack som vi kan bruke til å lage og drifte VM-er. Dette er ressursene vi har tilgjengelig for å kjøre alle våre tjenester.
{% /callout %}

## Oversikt over våre VM-er

Her er en omtrentlig oppdatert oversikt over våre aktive VM-er og deres formål:

| VM-navn   | Formål                                                               | IPv4-adresse                 |
| --------- | -------------------------------------------------------------------- | ---------------------------- |
| Adelie    | Hosting av småtjenester (Codex, Blitzed, Utlegg, Sporty m.m.)        | 192.168.0.41                 |
| Royal     | Hosting av Vaultwarden (passord-manager)                             | 192.168.0.34                 |
| Chinstrap | Proxy for innkommende trafikk (ruter trafikken videre til riktig VM) | 192.168.0.36 129.241.100.198 |
| King      | Hosting av TIHLDEs backend (Photon)                                  | 192.168.0.6                  |
| Fiordland | VM for TIHLDEs PostgreSQL cluster                                    | 192.168.0.140                |
| Macaroni  | VM for TIHLDEs Minecraft Server (KRITISK INFRASTRUKTUR)              | 192.168.0.84                 |
| Little    | Hosting av Grafana (monitoreringsverktøy)                            | 192.168.0.19                 |

_Se egne dokumentasjonssider for hver VM for mer detaljert informasjon._

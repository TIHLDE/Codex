---
title: Minecraft-server
---

TIHLDEs Minecraft-server kjører på en OpenStack VM med Docker. Denne guiden forklarer hvordan infrastrukturen er satt opp og hvordan du administrerer serveren.

## 1. Sett opp en server/instans for hosting

Start med å sette opp en VM, som du kan finne guide på [her](/docs/openstack/vm/web), men pass på at du velger følgende:

1. **Source** : Her kan du egentlig velge selv, men personlig anbefaler jeg Debian, og denne guiden ble skrevet for Debian 12.
2. **Flavour** : Det viktigste her er RAM. Det kommer litt an på hvor mange som kommer til å være logget inn på serveren samtidig og hvor mange mods/plugins du tenker å ha med, men jeg ville anbefalt minst 6GB og 2 vCPU uansett (dette vil nå deg opp til ca. 25-30 spillere).
3. **Networks** : Her må du velge den globale ruteren som NTNU skal ha fikset for dere. Det er mest sannsynlig den med _global_ i navnet, f.eks., _Network-ntnu-global_.

## 2 Nettverking

### 2.1 Security Groups

Sikkerhet er veldig viktig så vi vil først lage en _security group_ for instansen vår. Dette gjør at kun enkelte typer nettverking har lov til å kommunisere med serveren vår.

#### 2.1.1 Lag en sikkerhetsgruppe

Gå til _OpenStack_ -> _Network_ -> _Security Groups_, og lag en sikkerhetsgruppe med navn _minecraft-server_ eller lignende. Slett de to default reglene som er listet og lag følgende regler:

{% figure src="/images/security-group-rules.png" alt="Bilde av sikkerhets-reglere" /%}

Her er en rask oppsummering av hva hver enkelt port gjør:

- **25565** : Disse brukes for trafikken mellom Minecraft-klienter og selve Minecraft-serveren.
- **22** : Denne brukes for å kunne koble seg til serveren med SSH.
- **53** : Denne brukes av Minecraft-serveren for å kunne bruke DNS for å finne IP-adressen til Mojang for Minecraft-konto verifisering.
- **443** : Brukes under verifisering av Minecraft-kontoer når brukere logger inn på serveren.

#### 2.1.2 Ta sikkerhetsgruppen i bruk

Gå til _OpenStack_ -> _Compute_ -> _Instances_ og trykk 'Pil ned'-knappen på instansen din og trykk _Edit Security Groups_. Legg til (_+_) sikkerhetsgruppen du lagde og fjern (_-_) '_Default_'-gruppen.

### 2.2 Gi en global IP til Minecraft-serveren

For dette steget vil du trenge OpenStack-CLI'et. Instruksjoner for hvordan du installerer dette finner du [her](/docs/openstack/installation).

#### 2.2.1 Finne UUID-en til det eksterne nettverket

Gå til _OpenStack_ -> _Network_ -> _Routers_. Her vil du finne en liste over rutere. Noter deg ned UUID-en ('_External Network_'-kolonnen) på ruteren med _global_ i navnet. Det er veldig mulig at det står _(not found)_ bak UUID-en til ruteren, og at du fikk en error melding når du navigerte til siden som matcher denne UUID, men frykt ikke, det er normalt.

#### 2.2.2 Finn en global IP du kan bruke

Gå så til _OpenStack_ -> _Network_ -> _Floating IPs_. Her vil du se en liste over IP-adresser du kan bruke. Du vil notere deg ned en av IP-adresse som

1. har samme UUID i '_Pool_'-kolonnen som UUID-en du fant tidligere i .
2. ikke har noe i 'Mapped Fixed IP Address'-kolonnen.

#### 2.2.3 Gi Minecraft-serveren denne IP-en

Kjør følgende kommando for å binde IP-adressen med Minecraft-serveren:

```bash
$ openstack server add floating ip <navnet-på-minecraft-server-instansen> <ip-adressen-fra-forrige-steg>
```

Du skal ikke få noe output om kommandoen fungerte.

## 3 Minecraft-server oppsettet

TIHLDEs Minecraft-server kjører i en Docker-container med Fabric mod loader. Dette gjør det enkelt å administrere serveren og mods uten å måtte installere Java eller administrere dependencies manuelt.

### 3.1 Oversikt over systemet

Serveren er satt opp med følgende komponenter:

- **Docker**: Serveren kjører i en Docker-container basert på `itzg/minecraft-server` imaget
- **Versjon**: Minecraft 1.21.11
- **Mod loader**: Fabric (versjon 0.18.4)
- **RAM**: 8GB dedikert minne
- **Portering**: Port 25565 (Minecraft) og 24454 UDP (Voice Chat)

### 3.2 Filstruktur

```
macaroni-backup/
├── docker-compose.yml          # Docker-konfigurasjon for serveren
└── server/                     # Server-datamappe (mountet i containeren)
    ├── server.properties       # Server-innstillinger (difficulty, gamemode, etc.)
    ├── eula.txt               # Minecraft EULA aksept
    ├── ops.json               # Operatører/admins
    ├── whitelist.json         # Whitelist for spillere
    ├── banned-players.json    # Bannede spillere
    ├── banned-ips.json        # Bannede IP-addresser
    ├── .rcon-cli.env         # RCON passord for remote administrasjon
    ├── config/                # Konfigurasjonsfiler for mods
    │   ├── DistantHorizons.toml
    │   ├── lithium.properties
    │   ├── GrimAC/           # Anti-cheat konfigurasjon
    │   └── voicechat/        # Voice chat innstillinger
    ├── mods/                  # Installerte Fabric mods
    ├── world/                 # Spillverden (overworld)
    ├── DIM-1/                 # Nether-dimensjonen
    ├── DIM1/                  # End-dimensjonen
    ├── logs/                  # Server-logger
    └── crash-reports/         # Krasjrapporter
```

#### 3.2.1 Viktige filer

**docker-compose.yml**
Definerer hvordan serveren kjører. Inneholder konfigurasjon for:
- Minecraft-versjon og mod loader
- RAM-allokering (8GB)
- Automatisk nedlasting av mods fra Modrinth
- Port-mapping og restart-policy

**server.properties**
Hovedkonfigurasjonen for Minecraft-serveren:
- `difficulty=hard` - Vanskelighetsgrad
- `gamemode=survival` - Standard spillmodus
- `max-players=1993` - Maksimalt antall spillere
- `enable-rcon=true` - Aktiverer remote control
- `motd=Velkommen til TIHLDEs Minecraft Server!` - Server-beskrivelse

**Modrinth mods** (lastes ned automatisk):
- `fabric-api` - Nødvendig API for Fabric mods
- `lithium` - Ytelsesoptimalisering
- `grimac` - Anti-cheat
- `distanthorizons` - Distant rendering
- `simple-voice-chat` - Stemme-chat i spillet
- `sound-physics-remastered` - Realistisk lyd
- `servux` - Server-side utilities

### 3.3 SSH inn på VM-instansen

For å administrere serveren må du først SSH inn på VM-en:

```bash
ssh macaroni
```


## 4 Administrere serveren

### 4.1 Starte serveren

Naviger til mappen med `docker-compose.yml` og kjør:

```bash
docker compose up -d
```

Flagget `-d` kjører containeren i bakgrunnen (detached mode).

### 4.2 Stoppe serveren

For å stoppe serveren pent (slik at verden lagres ordentlig):

```bash
docker compose stop
```

Dette stopper containeren uten å slette den. For å stoppe og fjerne containeren:

```bash
docker compose down
```

### 4.3 Se server-logger

For å følge med på server-loggene i sanntid:

```bash
docker compose logs -f
```

Trykk `Ctrl+C` for å avslutte log-visningen (serveren vil fortsette å kjøre).

### 4.4 Restart serveren

For å restarte serveren (f.eks. etter konfigurasjonendringer):

```bash
docker compose restart
```

### 4.5 Kjøre kommandoer på serveren

Det er to måter å kjøre Minecraft-kommandoer på:

**Attach til containeren**
```bash
docker attach mc.tihlde.org
```

Nå er du koblet direkte til server-konsollen. Skriv kommandoer direkte (f.eks. `stop`, `whitelist add <navn>`, `op <navn>`).

{% callout title="OBS!" %}
For å detache fra konsollen uten å stoppe serveren: Trykk `Ctrl+P` deretter `Ctrl+Q`
{% /callout %}


## 5 Administrere verdenen

### 5.1 Manuell lagring

Serveren lagrer automatisk med jevne mellomrom, men for å tvinge en lagring:

```bash
# Via attach
docker attach mc.tihlde.org
save-all
# Detach med Ctrl+P, Ctrl+Q
```

### 5.2 Ta backup av verdenen

**Viktig**: Stopp serveren først for å sikre en konsistent backup!

```bash
# Stopp serveren
docker compose stop

# Tar backup av server-mappen
cd macaroni-backup
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz server/

# Start serveren igjen
docker compose up -d
```

Backupen inneholder alt: verden, konfigurasjon, spillerdata, etc.

### 5.3 Gjenopprette fra backup

```bash
# Stopp serveren
docker compose stop

# Slett eller flytt eksisterende server-mappe
mv server server.old

# Pakk ut backup
tar -xzf backup-20260310-120000.tar.gz

# Start serveren
docker compose up -d
```

### 5.4 Resette eller lage ny verden

For å starte på nytt med en helt ny verden:

```bash
# Stopp serveren
docker compose stop

# Ta backup først (valgfritt men anbefalt)
tar -czf old-world-backup-$(date +%Y%m%d).tar.gz server/world server/DIM-1 server/DIM1

# Slett verdensmappene
rm -rf server/world server/DIM-1 server/DIM1

# Start serveren - ny verden genereres automatisk
docker compose up -d
```

For å endre seed eller world-type, rediger `server/server.properties`:
```properties
level-seed=1234567890
level-type=minecraft:normal
```

Deretter slett world-mappene og restart som beskrevet over.

### 5.5 Oppdatere Minecraft-versjonen

Rediger `docker-compose.yml` og endre `VERSION`:

```yaml
environment:
  VERSION: 1.21.12  # Ny versjon
```

Deretter:
```bash
docker compose down
docker compose pull  # Laster ned nyeste server-image
docker compose up -d
```

{% callout title="Advarsel!" %}
Sjekk alltid at modene støtter den nye versjonen før du oppgraderer! Inkompatible mods kan krasje serveren.
{% /callout %}

## 6 Admin-oppgaver

### 6.1 Legge til/fjerne spillere fra whitelist

```bash
# Legge til
docker attach mc.tihlde.org
whitelist on  # Aktiverer whitelist-modus om den ikke er på
whitelist add <brukernavn>

# Fjerne
whitelist remove <brukernavn>
```

Alternativt kan du redigere `server/whitelist.json` direkte.

### 6.2 Gi/fjerne OP (operator) rettigheter

```bash
op <brukernavn> #Gi
deop <brukernavn> #Fjerne
```

Eller rediger `server/ops.json`.

### 6.3 Banne spillere

```bash
ban <brukernavn> [grunn]
ban-ip <ip-adresse> [grunn]

# Fjerne ban
pardon <brukernavn>
pardon-ip <ip-adresse>
```

### 6.4 Endre server-innstillinger

Rediger `server/server.properties` og restart serveren:

```bash
nano server/server.properties
docker compose restart
```

Viktige innstillinger:
- `difficulty` - peaceful, easy, normal, hard
- `gamemode` - survival, creative, adventure, spectator
- `max-players` - Maks antall spillere
- `pvp` - true/false
- `spawn-protection` - Radius rundt spawn (blokker)

### 6.5 Legge til eller fjerne mods

Rediger `MODRINTH_PROJECTS` i `docker-compose.yml`:

```yaml
MODRINTH_PROJECTS: |
  fabric-api
  lithium
  ny-mod-slug-fra-modrinth
```

Finn mod-slugs på [Modrinth](https://modrinth.com/mods?g=categories:%27fabric%27).

Restart serveren for å laste ned nye mods:
```bash
docker compose down
docker compose up -d
```

{% callout title="Tips!" %}
Du kan også manuelt legge `.jar`-filer i `server/mods/`-mappen, men Modrinth-metoden er anbefalt for enklere oppdateringer.
{% /callout %}

---
title: SSH - Brukerguide
---

## Oversikt

Denne guiden viser hvordan du som nytt medlem setter opp SSH-tilgang til Drift sine servere. Du vil lære:

- Hvordan generere SSH-nøkler på Mac, Linux og Windows
- Hvordan dele din public key med en administrator
- Hvordan konfigurere SSH-klient for enkel tilkobling til serverne
- Hvordan bruke proxy jump via Chinstrap

{% callout type="note" title="For administratorer" %}
Hvis du skal **gi** noen tilgang til serverne, se [SSH Administratorguide](/docs/drift/linux/ssh/admin).
{% /callout %}

## Generere SSH-nøkler

### Mac og Linux

1. Åpne terminal og kjør følgende kommando:

```bash
ssh-keygen -t ed25519 -C "ditt.navn@eksempel.no"
```

2. Du vil bli spurt om hvor nøkkelen skal lagres. Trykk Enter for å bruke standard lokasjon (`~/.ssh/id_ed25519`)

3. Du kan legge til en passphrase for ekstra sikkerhet (anbefales), eller trykk Enter for ingen passphrase

4. Nøklene blir nå generert:
   - **Private key**: `~/.ssh/id_ed25519` (ALDRI del denne!)
   - **Public key**: `~/.ssh/id_ed25519.pub` (denne deler du med serverne)

### Windows

#### Alternativ 1: WSL (Windows Subsystem for Linux) - Anbefalt

Følg samme fremgangsmåte som for Mac og Linux ovenfor.

#### Alternativ 2: PowerShell

1. Åpne PowerShell og kjør:

```powershell
ssh-keygen -t ed25519 -C "ditt.navn@eksempel.no"
```

2. Nøklene lagres i `C:\Users\DittBrukernavn\.ssh\`

### Vise din public key

For å se din public key, kjør:

**Mac/Linux/WSL:**
```bash
cat ~/.ssh/id_ed25519.pub
```

**Windows PowerShell:**
```powershell
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

Du får ut noe som ser slik ut:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJ ditt.navn@eksempel.no
```

## Dele din public key

### Send til en administrator

Kopier **hele** public key-linjen og send den til en Drift-administrator via:
- Discord (#drift-kanalen)

{% callout type="warning" title="Viktig!" %}
- Send **BARE** public key (filen som ender med `.pub`)
- Send **ALDRI** din private key (filen uten `.pub`)
- Hele nøkkelen må være på én sammenhengende linje
{% /callout %}

### Eksempel på melding

```
Sigve Eriksen(ditt navn)
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJ sigve.eriksen@student.ntnu.no
```

### Vente på tilgang

En administrator vil legge til din nøkkel på serverne. Du får beskjed når dette er gjort, og du kan teste tilkoblingen.

## Klient-side konfigurasjon

For å gjøre SSH-tilkobling enklere, kan du konfigurere SSH-klienten din.

### Opprette SSH config fil

1. Åpne/opprett config-filen:

**Mac/Linux/WSL:**
```bash
cd ~/.ssh
nano config
```

**Windows PowerShell:**
```powershell
cd $env:USERPROFILE\.ssh
notepad config
```

1. Legg til følgende konfigurasjon:

```ssh-config
# Proxy server - dette er inngangen til alle Drift sine servere
Host chinstrap
    HostName drift.tihlde.org
    User debian
    SetEnv TERM=xterm-256color

# Interne servere - disse må nås via chinstrap (proxy jump)
Host adelie macaroni fiordland king royal
    User debian
    ProxyJump chinstrap
    SetEnv TERM=xterm-256color
```

3. Lagre filen

4. Sett riktige tillatelser (Mac/Linux/WSL):
```bash
chmod 600 ~/.ssh/config
```

### Forklaring av konfigurasjon

- **Host**: Aliaser for serverne (du kan nå skrive `ssh adelie` i stedet for hele IP-adressen)
- **HostName**: Faktisk domene eller IP-adresse
- **User**: Brukernavn på serveren (vanligvis `debian`)
- **ProxyJump**: Hopper via chinstrap for å nå interne servere
- **SetEnv TERM**: Setter terminal-type for riktig fargevisning

### Servernavnene

Drift bruker følgende servere (oppkalt etter pingviner 🐧):

- **Chinstrap**: Proxy-server (drift.tihlde.org)
- **Adelie**: Webserver
- **Macaroni**: Minecraft-server
- **Fiordland**: Database-server
- **King**: Backend API-server
- **Royal**: Vaultwarden (passordbehandler)

## Koble til serverne

### Koble til Chinstrap (proxy)

```bash
ssh chinstrap
```

Eller med full kommando:
```bash
ssh debian@drift.tihlde.org
```

### Koble til interne servere

Med konfigurasjonen på plass, kan du nå koble direkte til interne servere:

```bash
ssh adelie
```

```bash
ssh macaroni
```

```bash
ssh fiordland
```

```bash
ssh king
```

SSH vil automatisk hoppe via Chinstrap for å nå disse serverne.


### Første gangs tilkobling

Når du kobler til en server for første gang, vil du få en melding om å verifisere fingeravtrykket:

```
The authenticity of host 'drift.tihlde.org (xxx.xxx.xxx.xxx)' can't be established.
ED25519 key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Skriv `yes` og trykk Enter.
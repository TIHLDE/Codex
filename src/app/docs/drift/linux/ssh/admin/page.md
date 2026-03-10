---
title: SSH - Administratorguide
---

## Oversikt

Denne guiden er for administratorer som skal gi nye medlemmer SSH-tilgang til Drift sine servere.

## Motta public key fra nytt medlem

Det nye medlemmet skal sende deg sin **public key**. Den ser typisk slik ut:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJ sigve.eriksen@student.ntnu.no
```

{% callout type="warning" title="Viktig!" %}
Det nye medlemmet skal **ALDRI** sende deg sin private key. Kun public key (filen som ender med `.pub`).
{% /callout %}

## Legge til public key på serverne

### Steg 1: Logg inn på serveren

```bash
ssh chinstrap
```

Eller den spesifikke serveren brukeren skal ha tilgang til:

```bash
ssh adelie
```

### Steg 2: Naviger til SSH-mappen

```bash
cd ~/.ssh
```

Hvis mappen ikke eksisterer, opprett den:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

### Steg 3: Rediger authorized_keys

```bash
nano authorized_keys
```

### Steg 4: Legg til public key

Legg til den nye public key på en ny linje, med en kommentar om hvem sin nøkkel det er:

```bash
# Sigve Eriksen
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJ sigve.eriksen@student.ntnu.no

# Borgir Barland
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfG anna.hansen@student.ntnu.no
```

### Steg 5: Sett riktige tillatelser (hvis det trengs)

```bash
chmod 600 ~/.ssh/authorized_keys
```

### Steg 6: Lagre og test

1. Lagre filen (i nano: `Ctrl + X`, deretter `Y`, deretter `Enter`)
2. Be det nye medlemmet teste tilkoblingen

Gjør deretter dette på alle andre servere.
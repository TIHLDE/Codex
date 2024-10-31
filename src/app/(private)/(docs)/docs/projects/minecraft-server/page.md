---
title: Minecraft-server
---

_skrevet 17.10.2024_

Minecraft er noe alle har spilt og det er enda gøyere med venner. Ved å følge denne guiden kan du lære hvordan du kan sette opp en Minecraft-server med hjelp av OpenStack.

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

## 3 Sett opp selve Minecraft-serveren

Da er det vanskeligste gjennomført! Vi skal nå gjøre siste steget som er å sette opp den faktiske minecraft serveren.

### 3.1 SSH inn på VM-instansen

For å kunne utføre kommandoer på VM-instansen må du SSH'e deg inn på serveren med følgende kommando:

```bash
ssh <image-navn>@<ip-adresse>
```

Jeg lagde en VM med Debian så _image-navn_ blir for meg `debian`. Bruker du Ubuntu vil det naturligvis være `ubuntu`.

### 3.2 Installer Java

Først må vi passe på at vi installerer en moderne nok Java-version, noe du kan finne ut [her](https://minecraft.wiki/w/Tutorials/Setting_up_a_server#Java_version).
Installasjonen for dette varierer litt ut i fra hvilken image du valgte da du laget VM-instansen, hvilken Java versjon du fant ut at du trenger.

**P.S.** : For de som bryr seg så krever Minecraft-serveren bare Java JRE så du må ikke ha JDK-en (men det går så klart fint det også).

Når dette ble skrevet (17.10.2024) så var siste Minecraft-server versjon 1.21.1 og dette krever minst Java 21. Desverre har Debian 12 repositoriene bare Java 17 så Java 21 må installeres på en litt annen metode for meg. Dersom du bruker Debian 13+ eller Ubuntu vil du mest sannsynlig kunne installere riktig Java versjon med:

```bash
$ sudo apt install default-jre
```

Skulle du være på akkurat Debian 12 og trenger nøyaktig Java 21 som jeg gjorde så kan du benytte disse kommandoene for å installere riktig Java versjon:

```bash
$ curl -O https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.deb
$ sudo dpkg -i jdk-21_linux-x64_bin.deb
```

Hvis ikke dette fungerte så kan du finne masse gode guides ved å google _How to install Java \<versjon> on \<din-linux-distro>_.

Du kan teste om du har installert Java riktig ved å kjøre:

```bash
$ java --version
```

Da skal du få ut noe som dette:

```bash
$ java --version
openjdk 21.0.4 2024-07-16
OpenJDK Runtime Environment (build 21.0.4+7)
OpenJDK 64-Bit Server VM (build 21.0.4+7, mixed mode, sharing)
```

Så lenge du ikke fikk noe `command not found` eller lignende, og versjonsnummeret er riktig så skal alt være greit.

### 3.3 (optional, but recommended) Lag en isolert Unix-bruker for å kjøre serveren

Dette steget er ikke noe du mååååå gjøre, men er sterkt anbefalt for sikkerhetsgrunner. Vi vil basically isolere Minecraft-server-instansen fra root brukeren på VM-instansen.

Kjør disse kommandoene for å lage en ny Unix-bruker for Minecraft-serveren:

```bash
# Lager hjemmemappen til brukeren
$ sudo mkdir /opt/minecraft

# Lager en unix-gruppe for brukeren
$ sudo groupadd --system minecraft

# Lager brukeren, setter den i minecraft-gruppen, og setter hjemmemappen til /opt/minecraft
$ sudo useradd --system --home-dir /opt/minecraft -g minecraft --shell $(which bash) minecraft

# Gir brukeren eierskap til alle filene i /opt/minecraft
$ sudo chown -R minecraft:minecraft /opt/minecraft

# Bytter til den nye brukeren
$ sudo su minecraft

# Hopper inn i /opt/minecraft
$ cd
```

### 3.4 Last ned Minecraft-server filen

Gå til [denne nettsiden](https://www.minecraft.net/en-us/download/server) og høyreklikk _minecraft_server.x.xx.x.jar_ og kopier lenken. Kjør deretter denne kommandoen for å laster ned filen gjennom terminalen:

```bash
curl -o server.jar <lenka-du-kopierte>
```

## 4 Start Minecraft-serveren!!! :DDDD

Kjør kommandoen under for å starte serveren. Dersom du gjorde det ekstra steget med egen unix-bruker så må du passe på at du kjører serveren som `minecraft`-brukeren.

```bash
$ java -Xmx4G -Xms4G -jar server.jar nogui
```

Første gang du kjører serveren vil den "krasje" fordi du må sette `eula=true` i eula.txt filen som blir generert. Etter du har gjort det vil du kunne starte serveren igjen.

Du skal nå kunne koble deg på serveren i Minecraft. IP-adressen du bruker er den samme som du fant tidligere (den du brukte i OpenStack-kommandoen). For å stoppe serveren skriver du bare `stop`.

Du kan endre hvor mange GB med RAM som skal være dedikert til Minecraft-serveren ved å endre `-Xmx4G` og `-Xms4G` til, for eksempel, `-Xmx6G` og `-Xms6G`, men pass på at VM-instansen har tilstrekkelig med RAM. Jeg vil anbefale å gi Minecraft-serveren minst 4GB.

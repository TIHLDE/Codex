_sist oppdatert: 2025-10-31 av Borgar_

# Macaroni

## Oversikt

Macaroni er en VM-instans på OpenStack som brukes til å hoste **TIHLDEs Minecraft-server**. Dette er **KRITISK INFRASTRUKTUR** (...for medlemmenes fritid og sosiale liv).

## Systemdetaljer

| Egenskap       | Verdi              |
| -------------- | ------------------ |
| VM-navn        | Macaroni           |
| IPv4-adresse   | 192.168.0.84       |
| Domene         | mc.tihlde.org      |
| Port           | 25565              |
| Operativsystem | Debian 13 (trixie) |

## SSH-konfigurasjon

### Velkomstmelding

Når du SSH-er inn på Macaroni blir du møtt med en hjelpetekst som viser de mest brukte kommandoene:

```
Skal du starte eller stoppe minecraft-serveren?

	systemctl start minecraft-server
	systemctl stop minecraft-server

Skal du kjøre en kommando på minecraft-serveren?

	./run-command.sh <kommando>

Filene for minecraft-serveren ligger i '/opt/minecraft/server'
MERK: helst rediger filene som 'minecraft'-brukeren (kjør: su minecraft)
```

### Automatisk root-bytte

På samme måte som de andre VM-ene blir du automatisk switchet fra **debian**-brukeren til **root**-brukeren ved innlogging.

{% callout title="Root-tilgang" type="warning" %}
Du får automatisk root-tilgang ved innlogging. Vær forsiktig med kommandoer du kjører for å ikke ødelegge Minecraft-serveren.
{% /callout %}

## Nettverkskonfigurasjon

Nettverkstrafikk som kommer til _mc.tihlde.org_ på port **25565** til proxy VM-en **Chinstrap** blir streamet videre til Macaroni. Dette gjør at spillere kan koble til Minecraft-serveren med **mc.tihlde.org**.

{% callout title="Les mer om nettverket" type="note" %}
Se dokumentasjonen for "Nettverking" for å lese mer om hvordan TCP stream forwarding fungerer for Minecraft-serveren.
{% /callout %}

## Minecraft-server

### Systemd-service

Minecraft-serveren kjører som en **systemd-service** som heter `minecraft-server.service`. Dette gjør at serveren:

- Starter automatisk ved oppstart av VM-en
- Restarter automatisk hvis den krasjer
- Kan administreres med standard systemd-kommandoer

### Service-konfigurasjon

Service-filen ligger i `/etc/systemd/system/minecraft-server.service`:

```ini
[Unit]
Description=Minecraft Server
After=network.target

[Service]
User=minecraft
Group=minecraft
WorkingDirectory=/opt/minecraft/server

ExecStart=/usr/bin/java -Xms6G -Xmx6G -jar server.jar --nogui
ExecStartPost=/usr/bin/sleep 15

ExecReload=/usr/local/bin/mcrcon -p a577bc86b5969ff844b18d87412d069d reload

ExecStop=/usr/local/bin/mcrcon -p a577bc86b5969ff844b18d87412d069d stop
ExecStop=/usr/bin/sleep 15

Restart=on-failure
RestartSec=20

ProtectControlGroups=true
ProtectHome=true
ProtectKernelModules=true
ProtectKernelTunables=true
ProtectSystem=full
PrivateDevices=true
PrivateUsers=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

**Viktige konfigurasjoner:**

| Konfigurasjon             | Betydning                                                                   |
| ------------------------- | --------------------------------------------------------------------------- |
| `User=minecraft`          | Serveren kjører som dedikert `minecraft`-bruker (ikke root)                 |
| `-Xms6G -Xmx6G`           | Minecraft-serveren får minimum og maksimum 6GB RAM                          |
| `Restart=on-failure`      | Serveren restarter automatisk hvis den krasjer                              |
| `RestartSec=20`           | Venter 20 sekunder før restart ved krasj                                    |
| `ExecStop` med mcrcon     | Bruker RCON for å stoppe serveren gracefully (sikrer at verden blir lagret) |
| `ProtectSystem=full` m.m. | Sikkerhetsfunksjoner som begrenser hva serveren har tilgang til på systemet |

### Administrere serveren

**Starte serveren:**

```bash
systemctl start minecraft-server
```

**Stoppe serveren:**

```bash
systemctl stop minecraft-server
```

**Restarte serveren:**

```bash
systemctl restart minecraft-server
```

**Se status:**

```bash
systemctl status minecraft-server
```

**Se logger (live):**

```bash
journalctl -u minecraft-server -f
```

### Kjøre kommandoer på serveren

For å kjøre kommandoer på Minecraft-serveren (f.eks. `/say`, `/tp`, `/gamemode`) bruker vi **mcrcon** (Minecraft RCON client).

Det finnes et hjelpescript i `/root/` som forenkler dette:

```bash
./run-command.sh <kommando>
```

**Eksempel:**

```bash
./run-command.sh say Hei alle sammen!
./run-command.sh weather clear
./run-command.sh op <navn>
```

#### Slik fungerer scriptet

`run-command.sh` ser slik ut:

```bash
#!/usr/bin/bash

mcrcon -p a577bc86b5969ff844b18d87412d069d -c "$*"
```

Scriptet bruker mcrcon med RCON-passordet for å sende kommandoen til Minecraft-serveren.

{% callout title="RCON-passord" type="note" %}
RCON-passordet er hardkodet i både systemd-servicen og `run-command.sh`. Dette passordet må matche det som er satt i Minecraft-serverens `server.properties`.
{% /callout %}

### Serverfiler

Alle filer for Minecraft-serveren ligger i `/opt/minecraft/server/`:

- `server.jar` - Minecraft server JAR-fil
- `server.properties` - Serverkonfigurasjon
- `world/` - Spillverdenen
- `plugins/` - Server-plugins (hvis Spigot/Paper)
- `ops.json` - Liste over operatører (admins)
- `whitelist.json` - Hviteliste (hvis aktivert)

{% callout title="Redigering av filer" type="warning" %}
Helst rediger filene som `minecraft`-brukeren (kjør: `su minecraft` før du redigerer filer) for å unngå tillatelsesproblemer. Minecraft-serveren kjører som `minecraft`-brukeren, så hvis du redigerer filer som root kan serveren miste tilgang til dem.
{% /callout %}

**Bytte til minecraft-bruker:**

```bash
su minecraft
```

### Manuell Backup

```bash
# Stopp serveren først
systemctl stop minecraft-server

# Ta backup
tar -czf minecraft-backup-$(date +%Y%m%d).tar.gz /opt/minecraft/server/

# Start serveren igjen
systemctl start minecraft-server
```

## Vedlikehold

### Oppgradere Minecraft-versjon

1. Stopp serveren: `systemctl stop minecraft-server`
2. Ta backup av `/opt/minecraft/server/`
3. Last ned ny `server.jar` til `/opt/minecraft/server/`
4. Sørg for at filen eies av `minecraft`-brukeren: `chown minecraft:minecraft server.jar`
5. Start serveren: `systemctl start minecraft-server`
6. Sjekk logger for eventuelle feil: `journalctl -u minecraft-server -f`

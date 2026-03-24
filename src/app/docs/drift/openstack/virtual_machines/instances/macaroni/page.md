# Macaroni

## Oversikt

Macaroni er en VM-instans på OpenStack som brukes til å hoste **TIHLDEs Minecraft-server**. Dette er **KRITISK INFRASTRUKTUR** (...for medlemmenes fritid og sosiale liv).

## Systemdetaljer

| Egenskap       | Verdi        |
| -------------- | ------------ |
| VM-navn        | Macaroni     |
| IPv4-adresse   | 192.168.0.84 |
| Operativsystem | Debian       |

## Velkomstmelding

Når du SSH-er inn på Macaroni blir du møtt med en hjelpetekst som viser de mest brukte kommandoene.

## Nettverkskonfigurasjon

Nettverkstrafikk som kommer til _mc.tihlde.org_ på port **48960** til proxy VM-en **Chinstrap** blir streamet videre til Macaroni. Dette gjør at spillere kan koble til Minecraft-serveren med **mc.tihlde.org**.

{% callout title="Les mer om nettverket" type="note" %}
Porten er endret fra standard Minecraft-port (25565) for å unngå at serveren blir lettere oppdaget av bots og skannere på internett. Chinstrap håndterer port forwarding og routing til Macaroni. Les deg opp på SRV records for å forstå hvordan bytting av minecraft port fungerer.
{% /callout %}

### Serverfiler

Alle filer for Minecraft-serveren ligger i `/opt/minecraft/server/`:

- `*.jar` - Minecraft server JAR-fil
- `server.properties` - Serverkonfigurasjon
- `world/` - Spillverdenen
- `plugins/`/`mods` - Server-plugins (hvis Spigot/Paper)
- `ops.json` - Liste over operatører (admins)
- `whitelist.json` - Hviteliste (hvis aktivert)

{% callout title="Redigering av filer" type="warning" %}
Husk å stopp serveren før du redigerer noen av disse.
{% /callout %}

## Vedlikehold

### Oppgradere Minecraft-versjon

1. Stopp serveren
2. Ta backup av serverfilene
3. Endre versjon i `docker-compose.yml`
4. Start serveren
5. Sjekk docker containeren sin logg for eventuelle feil

# King

## Oversikt

King er en VM-instans på OpenStack som brukes til å hoste **Photon**, TIHLDEs nye backend-applikasjon. Siden Photon er kritisk infrastruktur for TIHLDE har den fått en egen dedikert instans.

## Systemdetaljer

| Egenskap       | Verdi       |
| -------------- | ----------- |
| VM-navn        | King        |
| IPv4-adresse   | 192.168.0.6 |
| Operativsystem | Debian      |

## Nettverkskonfigurasjon

Adelie mottar all innkommende trafikk fra proxy-instansen **Chinstrap**.

Hvis du kjører `docker ps` på Adelie, vil du se en rekke containere som kjører forskjellige tjenester:

```
debian@king:~$ docker ps
CONTAINER ID   IMAGE                              COMMAND                  CREATED        STATUS                  PORTS                        NAMES
3694d2003d3e   production-photon.tihlde.org       "bun run ./dist/inde…"   42 hours ago   Up 42 hours             192.168.0.6:4000->4000/tcp   photon.tihlde.org
91654e015190   redis:alpine                       "docker-entrypoint.s…"   42 hours ago   Up 42 hours             6379/tcp                     photon.tihlde.org-redis
...
```

Her ser vi at tjenesten **Photon** kjører i en Docker-container, og er tilgjengelig fra subnettet 192.168.0.0/24 på port 4000. Når Chinstrap mottar en forespørsel for photon.tihlde.org, vil den rute denne forespørselen til King på port 4000, hvor Docker-containeren for Photon mottar den.

## Cronjobs

King har cronjobs som kjører regelmessig. Disse cronjobbene kan sees ved å kjøre `crontab -l`, eller redigeres med `crontab -e`.

# Adelie

## Oversikt

Adelie er en VM-instans på OpenStack som brukes i all hovedsak for hosting av alle TIHLDEs småtjenester og nettsider, som for eksempel Codex, Blitzed, Utlegg, Sporty, med flere. Disse tjeneste hosted i Docker containere.

## Systemdetaljer

| Egenskap       | Verdi        |
| -------------- | ------------ |
| VM-navn        | Adelie       |
| IPv4-adresse   | 192.168.0.41 |
| Operativsystem | Debian       |

## Nettverkskonfigurasjon

Adelie mottar all innkommende trafikk fra proxy-instansen **Chinstrap**.

Hvis du kjører `docker ps` på Adelie, vil du se en rekke containere som kjører forskjellige tjenester og portene de er tilgjengelige på. For eksempel:

```
debian@adelie:~$ docker ps
CONTAINER ID  IMAGE                           COMMAND                   CREATED         STATUS        PORTS                           NAMES
621598cc77f8  ghcr.io/tihlde/blitzed:latest   "docker-entrypoint.s…"    4 minutes ago   Up 4 minutes  192.168.0.41:4000->3000/tcp     blitzed.tihlde.org
...
```

Her ser vi at tjenesten **Blitzed** kjører i en Docker-container, og er tilgjengelig på subnettet 192.168.0.0/24 på port 4000. Når Chinstrap mottar en forespørsel for blitzed.tihlde.org, vil den rute denne forespørselen til Adelie (192.168.0.41) på port 4000, hvor Docker-containeren for Blitzed mottar den.

## Cronjobs

Adelie har cronjobs som kjører regelmessig. Disse kan du se med `crontab -l`, og redigere med `crontab -e`.

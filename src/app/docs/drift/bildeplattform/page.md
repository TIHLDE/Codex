---
title: Bildeproxy og filcache
---

_Sist kontrollert på King: 28.10.2026. Bildeproxyen kjører, men overgangen til offentlige og private bilde-URL-er er ikke bekreftet ferdig._

## Hva løsningen gjør

Photon lagrer originalbildene i objektlagring. Bildeproxyen på King kan hente et originalbilde, lage størrelsen nettleseren trenger, og legge resultatet i en filcache. Neste forespørsel om samme variant kan da bruke cachen. Cachen er midlertidige kopier; den er ikke backup av originalene.

Slik er hele kjeden ment å virke **etter** at Photon og Kvark er koblet på:

```text
Privat bilde: Nettleser → Photon → tilgangssjekk → kortvarig bildelenke

Bildelenke:   Nettleser → img.tihlde.org (Nginx) → img-proxy → Imagor → objektlagring
                                                 sjekker signatur   ↕
                                                                 filcache
```

Per kontrollen 28. oktober var kjeden fra `img.tihlde.org` til Imagor oppe. Det er ikke bekreftet at Photon og Kvark bruker den ennå.

`img-proxy` er [TIHLDEs Rust-tjeneste](https://github.com/TIHLDE/img-proxy). Den godtar bare bestemte bildeformater, nøkler og bredder. `/private/` krever en gyldig signatur med utløpstid; `/public/` gjør ikke det. Imagor er ikke publisert direkte på King. **En signatur erstatter ikke Photons tilgangssjekk:** Photon må avgjøre hvem som får en privat bildelenke før den lages.

## Status per 28. oktober 2026

Følgende er kontrollert på King:

| Del                                    | Observert status                                                                                                                                                                                          |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `img-proxy`, Imagor og `cache-cleanup` | Alle tre containerne kjører. Bare `img-proxy` er publisert på `127.0.0.1:8080`.                                                                                                                           |
| Nginx og DNS                           | `img.tihlde.org` når Nginx over HTTPS. Nginx videresender til port 8080 og består konfigurasjonstesten.                                                                                                   |
| Cache-volum                            | Eget 20 GiB ext4-volum er montert på `/mnt/imagor-cache` med `relatime`. Rundt 19 GiB var ledig ved kontrollen.                                                                                           |
| Cache-opprydding                       | Containeren er satt opp til daglig kjøring kl. 02:00 UTC, sletting av filer som ikke er brukt på over 30 dager, og en grense på 16 000 MiB. En faktisk planlagt oppryddingsrunde var ennå ikke observert. |
| Enkle tilgangstester                   | `/healthz` svarte 200; en usignert `/private/`-forespørsel svarte 403; en ukjent `/public/`-nøkkel svarte 404. Dette er ikke en full test med produksjonsbilder.                                          |

**Uavklarte punkter før fase 2 kan kalles ferdig:**

- Den kjørende proxyen bruker bøttenavnet `public` for `/public/`. Planen og Theons lokale oppsettseksempel bruker `photon-public`. Innholdet og hensikten med `public` er ikke kontrollert her. Bekreft at navneforskjellen er tilsiktet før nye offentlige URL-er tas i bruk. `/public/` må aldri peke på den blandede `photon-files`-bøtta.
- Photon og Kvark må kontrolleres sammen med Index før vi sier at de bruker nye URL-er. Photons `main` hadde fortsatt den gamle bildeveien ved denne gjennomgangen.
- Det er ikke dokumentert en gjenopprettingstest av full backup av originalbildene. Originaler og gamle bildeveier må beholdes til kopier, tilgang og tilbakerulling er verifisert.
- Cachefilrettigheter og en sperre som hindrer oppstart hvis volumet ikke er montert, bør gjennomgås før dette regnes som ferdig drift.

## Offentlige og private bilder

`photon-files` har historisk inneholdt både offentlige og private bilder. Derfor skal ingen åpen rute lese direkte fra hele denne bøtta. For et privat bilde skal Photon først sjekke brukerens tilgang og deretter gi en kortvarig signert `/private/`-lenke. Bare bilder som er kontrollert som offentlige, skal kopieres til en egen offentlig bøtte og få `/public/`-lenke.

Når et bilde som tidligere var offentlig blir privat, må det få en ny privat nøkkel. En gammel offentlig URL kan allerede ligge i nettleser- eller CDN-cache og kan ikke trekkes tilbake med bare en databaseendring. Ved tvil blir bildet på den gamle, tilgangsstyrte veien til klassifiseringen er avklart.

Ikke flytt eller slett originaler som del av cache-oppsettet. Filcachen kan tømmes og bygges opp igjen; objektlagringen kan ikke behandles slik uten verifisert backup.

## Trygge kontroller på King

Disse kommandoene leser status og endrer ikke oppsettet:

```bash
cd /home/debian/apps/imagor
docker compose ps
findmnt /mnt/imagor-cache
df -h /mnt/imagor-cache
sudo du -sh /mnt/imagor-cache
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/healthz
sudo nginx -t
```

`/healthz` skal gi `200`. Hvis bildetjenesten svarer lokalt, men ikke via domenet, sjekk DNS, sertifikat og Nginx. Hvis domenet virker, men et bilde feiler, sjekk først om URL-en bruker riktig offentlig eller privat rute og om en privat signatur er utløpt. Ikke del rå bildelenker, signaturer eller usladdede logger i åpne kanaler.

Før containerne startes på nytt, kontroller at `findmnt /mnt/imagor-cache` faktisk viser volumet. Ellers kan Docker skrive cachedata på Kings systemdisk. Opprydding i filcachen skal aldri brukes til å slette originalbilder i objektlagringen.

## Hva som må testes før omkobling

1. Bekreft bøttenavnet og at den offentlige bøtta bare inneholder godkjente offentlige bilder. Bruk syntetiske testbilder først.
2. Bekreft full backup ved å gjenopprette et utvalg originaler i et isolert miljø.
3. Test privat bilde med en bruker som har tilgang, en som ikke har tilgang, en utløpt signatur og et forsøk via `/public/`.
4. Kopier en liten gruppe godkjente offentlige bilder, kontroller kopiene, og bytt bare disse URL-ene. Behold den gamle bildeveien som tilbakerulling.
5. Følg med på feil, diskbruk og cachetreff før flere bilder kobles om. Stopp nye permanente bildevarianter i Photon først når den nye veien er verifisert.

Kilde for proxy og signeringsformat: [TIHLDE/img-proxy](https://github.com/TIHLDE/img-proxy). Se også [Kvarks nåværende bildehjelper](https://github.com/TIHLDE/Photon/blob/main/apps/kvark/src/lib/assets.ts) og [Photons nåværende nedlastingsrute](https://github.com/TIHLDE/Photon/blob/main/apps/api/src/routes/asset/download.ts). Fotons og Kvarks faktiske oppførsel må verifiseres mot versjonene som er i produksjon når omkoblingen gjøres.

---
title: Kiosk-skjerm
---

Kiosk skjermen er en raspberry pi koblet til TV'en som står der. Den trekker strøm fra en USB-A port på TV'en selv. Det kan godt være at denne leverer alt for lite effekt, men det var lett og den fungerer greit nok.

Om man vil endre noe på denne må man koble til med mus og tastatur.

Det er et debian system som er default med rapberry pi.

Det ligger et script i home (~) som kjøres av `systemd` hver gang pi'en booter som åpner firefox, fullscreener og går inn på kiosk skjerm siden på drift sin nettside [drift.tihlde.org/kiosk](https://drift.tihlde.org/kiosk)

Innloggingsdetaljene til lokalbrukerene `root` og `kiosk` ligger på TIHLDE sin vaultwarden, [vault.tihlde.org](https://vault.tihlde.org).

**Drift sitt ansvar for denne skjermen er å sørge for at TV'en og raspberry pi'en fungerer og at en browser åpnes til kiosk-skjerm siden og fullscreenes.**

**INDEX sitt ansvar er å programmere selve siden som vises.**

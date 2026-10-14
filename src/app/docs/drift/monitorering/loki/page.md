---
title: Loki – logging og retention
---

*Sist verifisert: 14.10.2026*

## Oversikt

Loki er TIHLDEs sentrale loggtjeneste og kjører i Docker på `little`. Logger fra blant annet Photon, Codex og Vaultwarden samles inn av Grafana Alloy og sendes til Loki. Loggene kan undersøkes gjennom Grafana.

Alle logger som lagres i Loki, har **90 dagers retention**.

## Konfigurasjon

Loki-konfigurasjonen ligger på `little`:

```text
/home/debian/monitoring/loki/loki-config.yaml
```

Viktigste innstillinger:

```yaml
compactor:
  retention_enabled: true
  retention_delete_delay: 2h
  delete_request_store: filesystem

limits_config:
  retention_period: 2160h
```

Compactor sørger for automatisk opprydding. Sletting skjer periodisk, med en forsinkelse på to timer før fysisk sletting.

Loggene lagres persistent i Docker-volumet `monitoring_loki-data`.

## Endring av konfigurasjon

Etter redigering og validering av konfigurasjonsfilen kan kun Loki-containeren gjenskapes:

```bash
cd /home/debian/monitoring
docker compose up -d --no-deps --force-recreate loki
```

Dette gir et kort avbrudd, men beholder eksisterende loggdata.

## Verifisering

Kontroller at Loki er tilgjengelig:

```bash
curl http://192.168.0.19:3100/ready
```

Kontroller retention-status:

```bash
curl -s http://192.168.0.19:3100/metrics \
  | grep loki_compactor_apply_retention_operation_total
```

Ved kontroll 14.10.2026 ble det bekreftet at:

- Retention kjører uten feil.
- Logger eldre enn 90 dager ikke lenger var søkbare i undersøkte perioder.
- Compactor hadde gjennomført over 12 000 vellykkede chunk-slettinger.

**Viktig:** Ikke slett loggfiler manuelt fra Docker-volumet. La Compactor håndtere oppryddingen.

# Infrastruktur

## Oversikt

Clippy kjører på én OpenStack-VM med GPU-tilgang. Systemet er delt mellom:

- Applikasjonskode
- Data- og lagringsområde

---

## Serveroppsett

### Compute

- Plattform: OpenStack
- Instans: erect-crested
- OS: Ubuntu
- GPU: 1/3 NVIDIA A40

---

## Filstruktur

### Applikasjonskode

Ligger i:

/home/ubuntu/ai-assistant

Her finnes:

- app.py (entrypoint)
- src/internal/ (kjernelogikk)
- scripts/ (automatisering)

---

### Datavolum

Mounted volum:

/mnt/ai-data

Dette ligger på Beluga-storage i OpenStack.

Brukes til:

- Markdown kunnskapsbase
- Vector databaser
- Andre store filer

Dette holdes separat for å:

- Unngå diskpress på systemdisk
- Gjøre migrering enklere

---

## Katalogstruktur

### Data

/mnt/ai-data/data/internal/drift

Inneholder alle markdown-filer Clippy trener på.

---

### Vector DB

/mnt/ai-data/vector_dbs

Inneholder Chroma-databaser generert av indekseringsscript.

---

## Scripts

Scripts ligger i:

/scripts

### auto_doc_infra.py

Henter automatisk dokumentasjon fra andre servere som:

- royal
- adelie
- chinstrap

---

### codex_retrieve_md.py

Henter alle markdown-filer fra Codex-systemet slik at Clippy kan oppdateres med ny kunnskap.

---

### auto_index.py

Ansvarlig for:

- Lese markdown-filer
- Generere embeddings
- Oppdatere vector DB

Script kjøres manuelt.

---

## Intern kode

### retriever.py

Ansvar:

- Laste vector DB ved init
- Utføre søk

Viktige metoder:

- init() – laster alle databaser
- search(query, k=5) – gjør vector + keyword search

---

### router.py

Kjernemodul for Clippy.

Ansvar:

- Definerer system_prompt
- Eksponerer /query endpoint
- Kommuniserer mellom bruker, retriever og LLM

---

## Drift og operasjon

### Script-kjøring

Alle scripts kjøres manuelt:

1. Aktiver virtualenv
2. Kjør script direkte

Ingen cron-jobber eller automatisering er satt opp.


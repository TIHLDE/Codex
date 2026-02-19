# Clippy

## Oversikt

Clippy er en intern AI-chatbot utviklet for å gi raske og presise svar basert på dokumentasjon og driftserfaring som utviklere sitter på. Systemet er designet som en lettvekts RAG-løsning (Retrieval Augmented Generation) som kan kjøres på lokal infrastruktur uten behov for eksterne API-tjenester.

Formålet med Clippy er å:

- Redusere tid brukt på å lete etter intern kunnskap
- Sentralisere dokumentasjon
- Gi kontekstbaserte svar på tekniske spørsmål
- Holde sensitiv intern informasjon lokalt

---

## Teknologi og arkitektur

### LLM

Clippy kjører lokalt via Ollama med:

- Modell: Llama 3.1
- Kun én aktiv modell
- GPU-avhengig (ingen CPU fallback)

LLM kjører på en OpenStack-instans med tilgang til 1/3 av en NVIDIA A40 GPU.

---

### Retrieval (RAG-pipeline)

Clippy bruker en klassisk retrieval-pipeline:

1. Markdown-dokumenter lagres i intern kunnskapsmappe
2. Dokumenter vektoriseres og lagres i en vector database
3. Ved spørsmål gjøres:
   - Embedding av query
   - Vector search
   - Keyword search
4. Topp-treff sendes til LLM som kontekst

---

## Vector Database

Clippy bruker:

- Chroma som vector database
- HuggingFaceEmbeddings for embeddings

Vector DB lagres lokalt på disk og initieres ved oppstart.

---

## System Prompt

Clippy har en fast system_prompt definert i:

src/internal/router.py

Denne brukes til å:

- Styre tone/personlighet
- Begrense svar til intern kontekst
- Redusere hallusinasjoner

---

## Workflow

### Dokumentflyt

Markdown-filer ligger i:

/mnt/ai-data/data/internal/drift

Disse blir vektorisert via:

scripts/auto_index.py

Resultatet lagres i:

/mnt/ai-data/vector_dbs

---

### Query-flyt

1. Bruker sender spørsmål til /query endpoint
2. Router sender query til retriever
3. Retriever:
   - Lager embedding
   - Søker i vector DB
4. Topp dokumenter returneres
5. System_prompt + dokumenter sendes til Ollama
6. Svar returneres med metadata:
   - Om kontekst ble brukt
   - Antall dokumenter brukt

---

## Brukere

Clippy er ment for:

- Utviklere
- Driftsteam

Systemet er kun tilgjengelig internt.

---

## Sikkerhet (nåværende status)

Per nå:

- Ingen autentisering
- Ingen rate limiting
- Ingen query logging

Autentisering planlegges via headers / web-frontend.

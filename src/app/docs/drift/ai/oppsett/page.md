# Oppsett

## Oversikt

Dette dokumentet beskriver hvordan man setter opp en ny Clippy-instans fra en ren server.

Guiden forutsetter:

- Ubuntu-server med GPU tilgjengelig
- NVIDIA-drivere er allerede installert på host (som i OpenStack-miljøet)
- Sudo-tilgang

---

## 1. Klargjør server

Oppdater systemet:

```s
sudo apt update
sudo apt upgrade -y
```

Installer grunnleggende pakker:

```
sudo apt install -y git python3 python3-venv python3-pip build-essential
```

---

## 2. Installer Ollama

Installer Ollama:

```
curl -fsSL https://ollama.com/install.sh | sh
```

Start Ollama:

```
ollama serve
```

Test installasjon:

```
ollama --version
```

---

## 3. Last ned LLM-modellen

Pull modellen:

```
ollama pull llama3.1
```

Verifiser:

```
ollama list
```

---

## 4. Klon Clippy-repo

```
cd /home/ubuntu

git clone <REPO_URL> ai-assistant

cd ai-assistant
```

---

## 5. Sett opp Python-miljø

Opprett virtualenv:

```
python3 -m venv venv
```

Aktiver:

```
source venv/bin/activate
```

Installer dependencies:

```
pip install -r requirements.txt
```

---

## 6. Sett miljøvariabler

Opprett .env fil i prosjektroot:

nano .env

Eksempelinnhold:

```
# Vector DB paths
VECTOR_DB_INTERNAL_PATH=/mnt/ai-data/vector_dbs/internal_drift
VECTOR_DB_STUDY_PATH=/mnt/ai-data/vector_dbs/study

# Common data and storage
DATA_PATH=/mnt/ai-data/data
MODELS_PATH=/mnt/ai-data/models
LOGS_PATH=/mnt/ai-data/logs

# Security
INTERNAL_API_KEY=<your-secret-token>
```


---

## 7. Monter datavolum

Opprett mountpunkt:

```
sudo mkdir -p /mnt/ai-data
```

Monter volum (tilpasses miljø):

```
sudo mount /dev/<volume> /mnt/ai-data
```

Opprett nødvendige mapper:

```
mkdir -p /mnt/ai-data/data/internal/drift
mkdir -p /mnt/ai-data/vector_dbs
mkdir -p /mnt/ai-data/cache/huggingface
mkdir -p /mnt/ai-data/nltk_data
```

---

## 8. Initialiser kunnskapsbase

Legg markdown-filer i:

/mnt/ai-data/data/internal/drift

---

## 9. Bygg vector database

Aktiver venv:

```
source venv/bin/activate
```

Kjør indeksering:

```
python scripts/auto_index.py
```

Dette vil:

- Generere embeddings
- Opprette Chroma DB
- Lage BM25 cache

---

## 10. Start API-server

Clippy kjøres via Uvicorn (ASGI-server).

Fra prosjektroot:

```
source venv/bin/activate
```

Start server:

```
uvicorn app:app --host 0.0.0.0 --port 8000
```

Serveren vil nå:

- Laste vector DB
- Initialisere retriever singleton
- Koble til Ollama
- Eksponere API-endepunkter

---

## 11. Verifiser systemet

Test health endpoint:

```
curl http://localhost:8000/
```

Test Ollama-tilkobling:

```
curl http://localhost:8000/ollama/health
```

Test query:

```
curl -X POST http://localhost:8000/internal/query \
     -H "Content-Type: application/json" \
     -H "x-api-key: <API_KEY>" \
     -d '{"question":"test"}'
```
---

## Vanlige feil

### Ollama svarer ikke

Sjekk:

ollama serve

---

### Vector DB mangler

Kjør:

python scripts/auto_index.py

på nytt.

---

### HuggingFace cache feiler

Sjekk at mappen eksisterer:

/mnt/ai-data/cache/huggingface

---

### BM25 cache mangler

Feilmelding:

bm25_docs.pkl not found

Løsning:

Kjør auto_index.py på nytt.

---

## Oppdatering av kunnskap

Når nye markdown-filer legges til:

1. Legg filer i drift-mappen
2. Kjør auto_index.py
3. Restart API-server

---

## Driftstips

- Ikke lagre data på systemdisk
- Bruk separat mount for /mnt/ai-data
- Ta manuell backup av vector_dbs


---

## 12. Kjør Clippy som en permanent tjeneste (systemd)

For at Clippy skal kjøre kontinuerlig, starte automatisk ved reboot, og kunne styres med `systemctl`, må det settes opp en systemd-service.

Dette er standard måten å kjøre backend-tjenester i produksjon på.

---

### Opprett service-fil

Lag en ny systemd-fil:

```
sudo nano /etc/systemd/system/clippy.service
```

Lim inn følgende:

```
[Unit]
Description=TIHLDE Clippy Backend
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu/ai-assistant

Environment="PYTHONPATH=/home/ubuntu/ai-assistant"

ExecStart=/home/ubuntu/ai-assistant/venv/bin/python -m uvicorn app:app --host 0.0.0.0 --port 8000

Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```
---

### Hva denne konfigurasjonen gjør

Denne service-filen sørger for at:

- Uvicorn kjører i bakgrunnen som en systemtjeneste
- Clippy starter automatisk ved server-reboot
- Tjenesten restartes automatisk hvis den krasjer
- Logger sendes til systemets journal (kan leses med journalctl)

---

### Aktiver tjenesten

Reload systemd slik at den oppdager den nye tjenesten:

```
sudo systemctl daemon-reload
```

Start Clippy:

```
sudo systemctl start clippy
```

Sett den til å starte automatisk ved boot:

```
sudo systemctl enable clippy
```

---

### Verifiser at tjenesten kjører

Sjekk status:

```
sudo systemctl status clippy
```
Se logger i sanntid:
```
sudo journalctl -u clippy -f
```
---


### Vanlige problemer

Hvis tjenesten ikke starter:

1. Sjekk logger:

journalctl -u clippy

2. Vanlige årsaker:
   - Feil path til virtualenv
   - Manglende .env
   - Vector database ikke initialisert
   - Manglende tilgang til /mnt/ai-data

---

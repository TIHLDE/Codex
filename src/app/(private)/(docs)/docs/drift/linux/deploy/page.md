---
title: Deploy Nettside på Adelie-serveren
---

Dokumentet viser hvordan man setter opp og deployer nettsider eller i dette eksempelet "Proton" på Adelie-serveren.

## 1. Opprett database
Før deploy, opprett en database for prosjektet ved å følge denne guiden:  
[Guide: Opprett database](https://codex.tihlde.org/docs/drift/databaser/create-database)

## 2. Klargjør prosjektet

- **Docker:** Sørg for at det eksisterer en fungerende `Dockerfile` i prosjektet.
- **Deploy-script:** Valider at `deploy.sh`-scriptet er korrekt og kjørbart.

## 3. Klone prosjektet til server

Logg inn på Adelie-serveren og klon repoet:
```bash
ssh adelie
git clone https://github.com/TIHLDE/Proton.git
```

## 4. Sjekk GitHub workflow

Bekreft at det finnes en GitHub workflow for deploy, for eksempel `deploy.yml`.

## 5. Legg til secrets i GitHub

Gå til repoet på GitHub:  
**Settings → Secrets and variables → Actions**  
Legg til følgende variabler:
- ENV
- SSH_PRIVATE_KEY
- PROXY_HOST
- USER
- HOST
- WORKING_DIR

## 6. Nginx-konfigurasjon

På Adelie-serveren:

1. Gå til nginx-konfigurasjonen:
    ```bash
    cd /etc/nginx/sites-available
    ```

2. Kopier template og opprett ny config:
    ```bash
    cp template.conf proton.tihlde.org.conf
    ```

3. Rediger `proton.tihlde.org.conf` med ønsket innhold (nano/nvim).

4. Opprett symlink til `sites-enabled`:
    ```bash
    ln -s ../sites-available/proton.tihlde.org.conf ../sites-enabled/
    ```

5. Test og reload nginx:
    ```bash
    nginx -t
    nginx -s reload
    ```

6. Husk å committe endringer:
    ```bash
    git add .
    git commit -m "["Navnet ditt"] Added Proton Config"
    ```
## 7. Deploy prosjektet

Gå til prosjektmappen og kjør deploy-scriptet:
```bash
cd ~/proton
chmod u+x deploy.sh
./deploy.sh
```

## 8. DNS-oppsett

Gå til [domeneshop.no](https://domeneshop.no), og legg til en **CNAME DNS record** for domenet som skal brukes. Pek denne mot `drift.tihlde.org`.

---

**NB:**  
- Bytt ut "Proton" med navnet på ditt på det nye nettstedet
- Endringer i nginx må alltid ha commits med eget navn i meldingen.

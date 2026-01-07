---
title: 'Makefile'
---

For å kjøre Lepton bruker vi det vi kaller en Makefile. Dette er en fil som gjør at vi kan kjøre make kommandoer. Dette gjør at vi kan skrive inn mindre i terminalen når vi skal starte, restarte og avslutte backend og andre ting. Du kan lese mer om hvordan du laster ned Make på din egen pc i seksjonen om innstallinger for nye medlemmer.

Vi skal nå ta en gjennomgang av de ulike kommandoene vi har.

## Start

```make
.PHONY: start
start: ## Start the webserver with docker on http://localhost:8000
	docker compose up
```

Dette er så enkelt som at det kjører en kommandoen **docker compose up**, som gjør at du kjører din Docker container.

## Avslutt

```make
.PHONY: down
down: ## Take down server
	docker compose down -v
```

Dette derimot tar ned containern. **-v** flagget sørger for at volumet som er på din lokale pc ikke fjernes. I vår tilfelle betyr det at databasen du har på din lokale pc som et volum, ikke fjernes slik at du må populerere databasen på nytt hver gang du starter opp containeren med **make start**.

## Restart

```make
.PHONY: restart
restart: ## Rebuild and start the server
	docker compose build
	make start
```

Noen ganger kan det hende at du trenger å bygge _bildet_ til kodebasen på nytt igjen, eller at du rett slett ikke har en containern på din pc. Dermed bruker man **restart** kommandoen som bygger opp et bilde for deretter å starte det.

## Fresh

```make
.PHONY: fresh
fresh: ## Perform a fresh build, install and start the server
	docker compose build
	make makemigrations
	make migrate
	make loaddata
	make start
```

Hvis du er ny på backend så er dette kommandoen du skal kjøre. Denne kjører en rekke med kommandoer som vi kommer tilbake til. Men oppsummert er det en kommando som bygger bildet, konfigurerer databasen, fyller data i databasen og starter containern.

## Lag en superbruker

```make
.PHONY: createsuperuser
createsuperuser: ## Create a new django superuser
	docker compose run --rm web python manage.py createsuperuser
```

Django har et eget admin panel som gir oss et grensesnitt for alle modeller vi har. For å få tilgang til dette må brukeren din, som du logger inn på nettsiden med være registrert som en superbruker. Ved å kjøre denne kommandoen derimot lager du en helt ny bruker. Det er derfor bedre å heller få en som allerede er superbruker til å gjøre deg til superbruker via panelet.

## Migrasjoner

```make
.PHONY: makemigrations
makemigrations: ## Create migration files
	docker compose run --rm web python manage.py makemigrations

.PHONY: migrate
migrate: ## Run django migrations
	docker compose run --rm web python manage.py migrate ${args}

.PHONY: migrations
migrations: ## Create migration-files and migrate immediately
	make makemigrations
	make migrate
```

Migrasjoner kan sees på som en konfigurasjon av databasen. Det er et sett med funksjoner Django bruker for å sette opp tabeller i databsen vår basert på modellene vi har laget.

Når du har laget en ny modell som du vil lage en migrasjon for kan du første kjøre **make makemigrations** og deretter **make migrate**, eller så kan du kjøre **make migrations** for å kjøre alt på en gang.

## Populering av database

.PHONY: dumpdata
dumpdata: ## Dump current data stored into ./app/fixture.json
docker compose run --rm web python manage.py dumpdata -e admin -e auth.Permission -e contenttypes --indent=4 > ./app/fixture.json

.PHONY: loaddata
loaddata: ## Load fixtures from ./app/fixture.json into the database
docker compose run --rm web python manage.py loaddata ./app/fixture.json

Når vi kjører kode i dev så er det gunstig å ha data vi kan teste ut med. Dermed har Django en egen fixture.json fil den bruker for å lagre dummy data og som man kan kjøre inn til databasen. Hvis du ønsker å legge til ting i databasen ved deretter å lagre det i kodebasen slik at andre kan bruke det, så kjører du **make dumpdata**. Hvis du deretter er i et annet miljø og ønsker å fylle inn data fra json filen som du kanskje ikke selv har i databasen, så kjører du **make loaddata**.

## Testing

```make
.PHONY: test
test: ## Run test suite
	docker compose run --rm web pytest ${args}

.PHONY: cov
cov: ## Check test coverage
	docker compose run --rm web pytest --cov-config=.coveragerc --cov=app
```

For å teste kode så kjører man **make test**, og for å sjekke hvor mye av kodebasen vår vi har testet så kjører man **make cov**.

{% callout title="Mer effektiv testing" %}
Ved å kjøre make test kjører du alle tester, og det tar en del tid. Hvis du ønsker å teste en enkelt fil eller til og med kun en enkelt test så kjør: make test args="-k veien/til/filen/eller/testnavn". Her betyr -k at du skal finne en enkelt fil eller navn på en test.
{% /callout %}

## Formatering

```make
.PHONY: format
format: ## Format code and imports
	make black
	make isort

.PHONY: check
check: ## Check formatting, imports and linting
	make black args="--check"
	make isort args="--check-only"
	make flake8

.PHONY: black
black: ## Format code only
	docker compose run --rm web black app/ ${args} --exclude migrations

.PHONY: isort
isort: ## Format imports only
	docker compose run --rm web isort . ${args}

.PHONY: flake8
flake8: ## Fheck code style
	docker compose run --rm web flake8 app
```

Her er et sett med ulike verktøy vi bruker for å formatere koden for å sørge for at vi følger et sett med best practice kriterier for god kodestil. Den eneste kommandoen du trenger å tenke på er **make format**, og denne burde kjøres hver gang før du pusher kode til en PR.

## PR

```make
.PHONY: pr
pr: ## Pull Request format and checks
	make format
	git add .
	make check
	make test
```

Vi har en egen kommando laget for PR. Denne er grei å kjøre som en siste kommando før du tenker du er ferdig med en PR og skal få den godkjent. Jeg ville derimot ikke brukt den for hver gang du pusher noe kode siden make test kjører som nevnt alle tester, og det tar sin tid.

---
title: 'Introduksjon'
---

Lepton benytter seg av følgende teknologier:

* Django
* Django REST
* MySQL
* Celery
* RabbitMQ
* Docker
* Sentry
* Azure blob storage
* Pytest

## Django Core og REST

Django er et rammeverk som gir muligheten til å lage applikasjoner som kobler sammen frontend og backend på en enkel og effektiv måte. Vi i Index derimot har flere ulike applikasjoner som bygger på samme backend API. Dette vil si at vi bruker Django til å lage et alenestående API. Django REST er et bibliotek som bygger videre på Django sin grunnleggende funksjonalitet. Dermed er mye av måten vi bruker Django på, helt likt som andre måter å bruke Django på.

## MySQL og Django ORM

Vi bruker MySQL som database, som vil si at vi bruker sql som spørringspråk for å hente, lage, slette og opprette data i vår database. Selv om det er viktig å ha en god forståelse for sql og gode kunnskaper innenfor det, er det ikke anbefalt å bruke rene sql spørringer i større prosjekter. Det er flere årsaker til det som f.eks. stabilitet, likhet, sikkerhet, effektivtet osv.

Heldigvis har django en innebygget ORM (Object-Relational Mapping). Det er en kraftig funksjon som lar oss samhandle med databasen ved hjelp av Python-kode i stedet for SQL.

```python
# opprett en ny bok (id blir autogenerert)
new_book = Book(title='Brave new world', author='Aldous Huxley')
new_book.save()

# hent alle bøker
books = Book.objects.all()

# hent en spesifikk bok. OBS! Ikke anbefalt måte å hente spesifikk gjenstand
book = Book.objects.get(id=1)

# hent en spesifikk bok. OBS! Dette er en bedre måte å gjøre det på
# men det krever at man finner filtrerer etter et unikt attributt
book = Book.objects.filter(id=1).first()

# oppdater attributt til en bok
book.title = 'Lepton på 123'
book.save()

# slett en bok
book.delete()
```

Det finnes mange flere funksjoner og måter å bruke ORM'et på. Du kan lese mer om det [her.](https://docs.djangoproject.com/en/5.0/topics/db/queries/)

## Celery

Celery er verktøy som gir oss muligheten til å lage "tasks". Dette bruker vi blant annet for å sende ut daglige eposter til aktuelle medlemmer av TIHLDE klokken 12:00. Det brukes også for å sjekke om betalte påmeldinger blir betalt innen riktig tid. Du kan lese mer om bruk av celery her:

* [Introduksjon til Celery](https://codex.tihlde.org/)
* [Bruk av Celery og Vipps](https://codex.tihlde.org/)


## RabbitMQ

RabbitMQ er det vi kaller en "message broker". Vi bruker dette for å sette opp køer for prosesser som kjører på backend. Eksempelvis har vi arrangementer som har opptil 150 påmeldinger på et sekund. Dette fører til en stor trafikk på systemene våre som kan føre til at de går ned. For å redusere pågangen vil RabbitMQ styre inngående trafikk i køer som reduserer pågangen.


## Docker

Docker er en plattform for containerisering som gjør det mulig å pakke en applikasjon sammen med alle dens avhengigheter, biblioteker og konfigurasjoner, slik at den kan kjøre konsistent på tvers av ulike miljøer. Ved å kjøre Lepton gjennom Docker, har vi ikke noe behov for å laste ned pakker, eller Python forsåvidt, for å kjøre koden vår. Dette resulterer i at alle kan kjøre samme kode uten problemer forårsaket av et noen bruker macOS og noen Windows.


## Sentry

Sentry overvåker ytelse for systemet vårt. Vi bruker det for å logge feil som skjer i systemet. Sentry gir oss også en egen webplattform der vi kan se detaljerte logger på feil som skjer. Vi får også ukentlige mail som varsler oss om antall feil per uke.


## Azure blob storage

Siden vi hoster både database, og Lepton på Azure, så er det naturlig at vi lagrer filer her også. Derfor har vi implementert Azure blob storage funksjonalitet for å kunne laste opp filer. Dette blir introdusert mer i dybden i vår [dokumentasjon om  filopplastning.](https://codex.tihlde.org/)

## Pytest

Når man utvikler et API er det viktig å teste koden. På denne måten kan vi teste koden opp i mot diverse relevante scenarioer. Dette gjelder både unittesting og integrasjonstesting. Det må merkes at det ikke er mulig å teste mot alle mulige scenarioer. Noen feil finner vi at av bruk i produksjon. Du kan lese mer om dette i vår [dokumentasjon om testing.](https://codex.tihlde.org/)
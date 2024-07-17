---
title: "Django ORM"
---

ORM står for Object-Relational Mapping og er metodikk for å kunne gjøre SQL spørringer ved hjelp av objekter og funksjoner. Fordelen med dette er at det blir lettere for oss utviklere å utføre spørringer til databasen vår uten å gjøre feil, som i verste fall kan ødelegge dataen vår i databasen. Django har selv en egen ORM innebygget i rammeverket. 

**Obs!** Det anbefales å gjøre seg kjent med hvordan strukturen til Django og de ulike byggeklossene fungerer før man setter seg inn i denne seksjonen. Deler av Django sin ORM blir forklart gjennom de ulike seksjonene.

## Er ORM bedre enn rå SQL?
En ORM er konstruert for å prøve å standardisere spørringer, slik at du som utvikler til enhver tid vet hva du gjør og får som svar. Dette øker kodesikkerheten og reduserer risikoen for å tukle med data på en negativ måte. Derimot så er ulempen ved denne standardiseringen optimalisering og spesialtilfeller. Det er vanskelig å både ha et system som forenkler og standardiserer spørringer samtidig som at det skal kunne ta høyde for alle mulige scenarioer.

Men i bunn og grunn er Django sin ORM optimal for oss i Index og skal brukes til enhver tid. Det er mulig å skrive rå SQL ved hjelp av en egen metode i ORM'en, men **DETTE SKAL ALDRI GJØRES!**

## Første steg for å benytte seg av ORM
Siden ORM benytter seg av objekter, så man vi først lage en modell som vi kan stille spørringer mot. Husk at en modell representerer en tabell i en database og vi bruker dermed ORM'en for å hente ut og manipulere data fra modellen sin tabell. Denne seksjonen følger [Django sin egen dokumentasjon](https://docs.djangoproject.com/en/5.0/topics/db/queries/), og vi benytter oss dermed av samme eksempel som dem, en blogg. Hvis du har lest deg gjennom resten av dokumentasjonen burde dette være kjent for deg.

```python
from datetime import date

from django.db import models


class Blog(models.Model):
    name = models.CharField(max_length=100)
    tagline = models.TextField()

    def __str__(self):
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()

    def __str__(self):
        return self.name


class Entry(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    headline = models.CharField(max_length=255)
    body_text = models.TextField()
    pub_date = models.DateField()
    mod_date = models.DateField(default=date.today)
    authors = models.ManyToManyField(Author)
    number_of_comments = models.IntegerField(default=0)
    number_of_pingbacks = models.IntegerField(default=0)
    rating = models.IntegerField(default=5)

    def __str__(self):
        return self.headline
```

## Oppretting av rader i tabellen
For å opprette nye rader i vår tabell bruker vi følgende metoder på vår modell:

```python
from blog.models import Blog
b = Blog(name="Beatles Blog", tagline="All the latest Beatles news.")
b.save()
```

Her er det viktig å bemerke at Django ikke gjør noen endringer på tabellen før save() metoden har blitt kalt på dette. Dette gjelder for alt som omgår ORM'en.


## Oppdatere attributter ved raden
For å oppdatere data er det like enkelt som å endre en variabel i Python:

```python
b.name = "New name"
b.save()
```

## Hvordan håndtere fremmednøkler
Noe av magien ved Django er at når man oppretter fremmednøkler til en modell i form av en-til-mange, en-til-en eller mange-til-mange relasjoner så lages det koblingstabeller i bakgrunnen som tar hånd om dette. Dette gjør det også lett å håndtere disse fremmednøklene ved ORM.

```python
from blog.models import Blog, Entry

entry = Entry.objects.get(pk=1)
cheese_blog = Blog.objects.get(name="Cheddar Talk")
entry.blog = cheese_blog
entry.save()
```

I dette eksempelet ser man hvordan man kan hente ut en *Entry* basert på primærnøkkelen og deretter en *Blog* instans som vi kobler opp mot entry.


### mange-til-mange relasjon
Siden en mange-til-mange relasjon åpner for at en *Entry* instans kan ha flere forfattere, er det enkelt å legge til en eller flere *Author* instanser.

```python
john = Author.objects.create(name="John")
paul = Author.objects.create(name="Paul")
george = Author.objects.create(name="George")
ringo = Author.objects.create(name="Ringo")

entry.authors.add(john, paul, george, ringo)
```

Ved å benytte add() metoden etter navnet på attributtet som peker til mange-til-mange feltet til modellen *Entry* kan man legge til en eller flere instanser av modellen *Author*. Hvis man sender inn feil type, vil Django gi en feilmelding.

## Uthenting av data
Django sin ORM bruker en egen klasse **QuerySet** som er en samling av instanser hentet fra databasen. Det er flere metoder man kan benytte seg av for å filtrere ut data. Men fellestegnet er at alle metodene må ha følgende nøkkelord mellom modell klassen og selve metoden:

```python
all_blogs = Blog.objects.all()
```

Her ser vi hvordan vi igjen bruker selve klassen til modellen (Blog) og benytter oss av nøkkelordet objects, som tilsier at vi nå skal hente noe data. Metoden all() brukes for å hente ut alle rader in tabellen til Blog.

### Filtrering

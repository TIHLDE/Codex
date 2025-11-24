---
title: 'Django ORM'
---

ORM står for Object-Relational Mapping og er metodikk for å kunne gjøre SQL spørringer ved hjelp av objekter og funksjoner. Fordelen med dette er at det blir lettere for oss utviklere å utføre spørringer til databasen vår uten å gjøre feil, som i verste fall kan ødelegge dataen vår i databasen. Django har selv en egen ORM innebygget i rammeverket.

## Er ORM bedre enn rå SQL?

En ORM er konstruert for å prøve å standardisere spørringer, slik at du som utvikler til enhver tid vet hva du gjør og får som svar. Dette øker kodesikkerheten og reduserer risikoen for å tukle med data på en negativ måte. Derimot så er ulempen ved denne standardiseringen optimalisering og spesialtilfeller. Det er vanskelig å både ha et system som forenkler og standardiserer spørringer samtidig som at det skal kunne ta høyde for alle mulige scenarioer.

Men i bunn og grunn er Django sin ORM optimal for oss i Index og skal brukes til enhver tid. Det er mulig å skrive rå SQL ved hjelp av en egen metode i ORM'en, men **DETTE SKAL ALDRI GJØRES!**. Hvis det er behov for å skrive rå SQL, så ta kontakt med den ansvarlige for Lepton og diskuter behovet.

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

I dette eksempelet ser man hvordan man kan hente ut en _Entry_ basert på primærnøkkelen og deretter en _Blog_ instans som vi kobler opp mot entry.

### mange-til-mange relasjon

Siden en mange-til-mange relasjon åpner for at en _Entry_ instans kan ha flere forfattere, er det enkelt å legge til en eller flere _Author_ instanser.

```python
john = Author.objects.create(name="John")
paul = Author.objects.create(name="Paul")
george = Author.objects.create(name="George")
ringo = Author.objects.create(name="Ringo")

entry.authors.add(john, paul, george, ringo)
```

Ved å benytte add() metoden etter navnet på attributtet som peker til mange-til-mange feltet til modellen _Entry_ kan man legge til en eller flere instanser av modellen _Author_. Hvis man sender inn feil type, vil Django gi en feilmelding.

## Uthenting av data

Django sin ORM bruker en egen klasse **QuerySet** som er en samling av instanser hentet fra databasen. Det er flere metoder man kan benytte seg av for å filtrere ut data. Men fellestegnet er at alle metodene må ha følgende nøkkelord mellom modell klassen og selve metoden:

```python
all_blogs = Blog.objects.all()
```

Her ser vi hvordan vi igjen bruker selve klassen til modellen (Blog) og benytter oss av nøkkelordet objects, som tilsier at vi nå skal hente noe data. Metoden all() brukes for å hente ut alle rader in tabellen til Blog.

### Filtrering

Med filtrering kan man hente ut data basert på ulike kriterier. Det kan være en enkelt filtrering eller flere ulike etter hverandre.

```python
# Enkel filtrering
Entry.objects.filter(pub_date__year=2006)

# Lenking av filtrering
# exclude brukes her for å ekskludere alle entries som har en publiseringsdato etter idag.
Entry.objects.filter(headline__startswith="What").exclude(
    pub_date__gte=datetime.date.today()
).filter(pub_date__gte=datetime.date(2005, 1, 30))
```

Merk at man bruker dobbel understrek (\_\_) for å velge ut attributter på en modell som er fremmednøkkel eller, som i dette tilfellet, for å bruke "funksjoner". I dette tilfellet er så betyr _\_\_gte_ "greater than or even".

### Lazy uthenting

Det kan være greit å merke seg at Django sin ORM benytter en metodikk som heter lazy, som vil si at den ikke kjører noen SQL spørringer mot en database før instansen(e) som blir hentet ut er kalt på.

```python
q = Entry.objects.filter(headline__startswith="What")
q = q.filter(pub_date__lte=datetime.date.today())
q = q.exclude(body_text__icontains="food")
print(q)
```

Det vil si at det ikke her blir utgjort tre ulike spørringer, men at Django sin ORM slår sammen de tre kallene sammen til èn SQL spørring i det man anvender q instansen. Dette betyr at vi kan utføre flere filtreringer osv basert på flere variabler før uten å bekymre oss for overdådig bruk av SQL kall.

### Uthenting av èn enkelt instans

Django sin dokumentasjon viser til get() metoden for å hente ut en spesifikk instans basert på et kriterie:

```python
one_entry = Entry.objects.get(pk=1)
```

Ulempen med get() metoden er at hvis det ikke finnes en rad som tilhører dette kriteriet vil det bli kastet en feil som vil stoppe koden hvis det ikke er tatt hånd om. Dermed må get() metoden kun bli brukt i følgende kontekst:

```python
try:
    one_entry = Entry.objects.get(pk=1)
except Entry.DoesNotExist:
    # Håndter at det ikke finnes en instans
```

På grunn av dette anbefaler vi heller å benytte seg av filter() metoden sammen med first(), på følgende måte:

```python
# one_entry er lik None hvis instansen ikke finnes.
one_entry = Entry.objects.filter(pk=1).first()

if not one_entry:
    # Håndter at det ikke finnes en instans

# Fortsett med koden
```

Selv om det er viktig å alltid håndtere feil som blir kastet, så har vi erfart at det er mer hensiktmessig og fører til mindre bugs å benytte seg av sistenevnte metode.

### Limit og sortering

Ofte så vil du kun ha et x antall instanser uten å måtte hente ut alle instanser for deretter å velge ut et x antall. Dermed bruker Django sin ORM python sin innebygde list slicing, men i dette tilfellet vil det påvirke selve SQL spørringen, og ikke selve resultatet i etterkant.

```python
Entry.objects.all()[5:10]

# Er det samme som SQL
OFFSET 5 LIMIT 5
```

I dette tilfellet henter man ut fra og med nummer 6 til 10 i tabellen.

For å sortere basert på en verdi i raden bruker man følgende metode:

```python
# Dette er ascending
Entry.objects.order_by("headline")

# Dette er descending
Entry.objects.order_by("-headline")
```

Her ser man at man kan snu opp ned på rekkefølgen ved å sette et minustegn (-) før attributtnavnet.

### Lookup metoder

Som nevnt tidligere så kan man benytte seg av dobbel understrek og navnet på en metode som man sjekker opp imot en verdi. Det er flere ulike metoder man kan benytte, og [her kan du se en oversikt](https://www.w3schools.com/django/django_ref_field_lookups.php).

I noen tilfeller kan det være et attributt for en modell som ikke støtter alle de ulike metodene. Hvis du ønsker å få en liste over hvilke metoder som er støttet for et attributt i en modell kan du kalle på følgende metode:

```python
MyModel._meta.get_field("my_field").get_lookups()

# Eksempel
Entry._meta.get_field("headline").get_lookups()
```

Det ble også nevnt tidligere at man kan bruke dobbel understrek (\_\_) for å filtrere opp i mot fremmednøkler, og deretter kan man bruke lookup metoder på disse verdiene også:

```python
# Filtrerer etter blogg instanser som har forfatter,
# men der navnet er satt til null verdi
Blog.objects.filter(
    entry__authors__isnull=False,
    entry__authors__name__isnull=True
)
```

Ut ifra dette eksempelet ser man også at det er mulig å benytte seg av flere filtere i samme metode.

### Sammenligning av to attributter

I noen tilfeller kan det hende at du vil filtrere etter en verdi for en attributt sammenlignet med verdien til et annet attributt. Django har dermed **F-klassen** som man kan bruke for dette:

```python
from django.db.models import F

Entry.objects.filter(number_of_comments__gt=F("number_of_pingbacks"))
```

I dette tilfellet vil man hente ut alle instanser av _Entry_ som har har et antall kommentarer som er større enn antall pingbacks.

### Kompleks filtrering med Q

Noen ganger ønsker man mer komplekse filtreringer, som blant å bruke en OR operant eller negativt. Dermed kan man bruke **Q-klassen** til Django:

```python
Entry.objects.filter(Q(authors__name__startswith="Elon") | ~Q(pub_date__year=2005))
```

I dette tilfellet vil man filtrere etter _Entry_ instanser som enten har et forfatter navn som starter med Elon eller som ikke er publisert i 2005. Merk at hvis vi hadde fjernet ~ symbolet før Q, så ville vi sett etter en publiseringsdato som var i 2005.

## Sletting av data

For å slette data er det ganske rett frem.

```python
b = Blog.objects.get(pk=1)
# Dette vil slette den spesifikke instansen
b.delete()

# Dette vil slette alle instanser
Blog.objects.all().delete()
```

Her er det ikke behov for å bruke save() metoden siden den utføres ved bruk av delete() metoden. Det er viktig å merke seg at hvis man har satt on_delete=CASCADE i modellen til _Blog_ så vil alle _Entry_ instanser tilhørende _Blog_ instansene bli slettet.

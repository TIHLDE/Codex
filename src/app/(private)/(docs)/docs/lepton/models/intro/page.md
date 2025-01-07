---
title: 'Modeller og tabeller i databasen'
---

I introduksjonen til Lepton viste vi hvordan en modell er et sett med instrukser som Django bruker for å opprette tabeller i databasen vår. I denne artikkelen skal vi se nærmere på hvordan modeller kan settes opp og hva man kan gjøre.

## Abstrakte modeller

Som nevnt tidligere, har vi 4 modeller i kodebasen vår som alle våre modeller arver fra. Av de 4 er det 2 som man alltid skal arve fra, og to som er valgfrie. Alle disse 4 modellene er abstrakte, som vil si at de ikke skal brukes for seg selv, men som en forelder til andre klasser.

### Base Model

```python
class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        abstract = True
```

Denne modellen gjør ikke noe mer spesielt enn å legge til to felter som holder kontroll over dato en instans av tabellen blir laget og når det oppdateres. Dette legges til i instansen automatisk hver gang en instans opprettes eller oppdateres.

#### Eksempel

```python
from app.util.models import BaseModel


class Book(BaseModel):
    title = models.CharField(max_length=200)
    description = models.TextField(default="", blank=True)

    # Disse feltene blir lagt til automatisk
    created_at
    updated_at
```

### Permission Model

```python
class BasePermissionModel(models.Model):
    read_access = []
    write_access = []

    class Meta:
        abstract = True

    @classmethod
    def has_read_permission(cls, request):
        if not len(cls.read_access):
            return True
        return check_has_access(cls.read_access, request)

    @classmethod
    def has_write_permission(cls, request):
        if not len(cls.write_access):
            return True
        return check_has_access(cls.write_access, request)

    def has_object_write_permission(self, request):
        return self.has_write_permission(request)

    def has_object_read_permission(self, request):
        return self.has_read_permission(request)
```

Denne modellen er den siste obligatoriske modellen, som i likhet med BaseModel må arves hver gang du oppretter en ny modell. Vårt rettighetssystem er bygget oppå denne modellen. Kort fortalt så sjekker denne modellen om en bruker er en del av en gruppe som har write og read access. Dette tilsier om en bruker har lov til å lage, oppdatere og slette en instans, og om brukeren kan lese instansen. Du kan lese mer om rettighetssystemet under aksesskontroll.

#### Eksempel

```python
from app.common.permissions import BasePermissionModel


class Book(BasePermissionModel):
    read_access = (Groups.TIHLDE,)
    write_access = (*AdminGroup.admin(),)

    title = models.CharField(max_length=200)
    description = models.TextField(default="", blank=True)
```

Her ser vi et eksempel på hvordan man kan opprette en ny modell som overkjører read_access og write_access fra BasePermissionModel. Nå må man være et medlem av TIHLDE (altså innlogget bruker) for å kunne se en eller flere instanser av denne tabellen, og man må være en del av admin-gruppa (HS og Index) for å lage, oppdatere, og slette en instans.

### Optional Image (valgfritt bruk)

```python
class OptionalImage(models.Model):
    image = models.URLField(max_length=600, null=True, blank=True)
    image_alt = models.CharField(max_length=200, null=True, blank=True)

    class Meta:
        abstract = True
```

Denne modellen er valgfri og en modell arver fra denne hvis man skal ha et bilde. Et eksempel er Event modellen som arver fra denne for å kunne legge ved et forsidebilde for et Event.

#### Eksempel

```python
from app.util.models import OptionalImage


class Event(OptionalImage):
    title = models.CharField(max_length=200)
    description = models.TextField(default="", blank=True)

    # Disse feltene blir lagt til automatisk
    image
    image_alt
```

### Optional File (valgfritt bruk)

```python
class OptionalFile(models.Model):
    """Abstract model for models containing a file"""

    file = models.URLField(max_length=600, null=True, blank=True)

    class Meta:
        abstract = True
```

Denne modellen er valgfri og en modell arver fra denne hvis man skal ha et fil. Den fungerer helt likt som OptionalImage, men for filer. Denne modellen kan kombineres med OptionalImage for å ha både bilde og fil.


#### Eksempel

```python
from app.util.models import OptionalFile


class Event(OptionalFile):
    title = models.CharField(max_length=200)
    description = models.TextField(default="", blank=True)

    # Disse feltene blir lagt til automatisk
    file
```


{% callout title="Flere filer / bilder" %}
Både OptionalImage og OptionalFile tilbyr kun en enkelt fil eller bilde. Hvis du trenger flere filer eller bilder, må du lage en egen modell for dette som kobler sammen flere filer / bilder til én enkelt instans.
{% /callout %}

## Meta

Som dere nå trolig har lagt merke til så er det mulig å definere en egen klasse inni modellklassen som heter Meta. Det som skjer her er at man kan endre på hvordan feltene i modellen fungerer. Den vanligste grunnen til at vi bruker den er for å bestemme hvordan en liste med instanser skal sorteres.

```python
class Meta:
        ordering = ("create_at",)
```

I dette eksempelet ser vi hvordan en liste av instanser vil bli sortert etter created_at tidspunkt. Hvis man skriver -created_at sorteres det i DESC, men uten - så er det ASC.

Du kan lese mer om de ulike valgene i [Django sin egen dokumentasjon](https://docs.djangoproject.com/en/5.0/ref/models/options/).

## Representasjon

I Python kan man definere hvordan et objekt av en klasse skal leses hvis man bruker str() metoden på objektet. I Django gjør vi det samme, så vi kan representere en instans i Django sitt eget admin panel.

```python
def __str__(self):
    return f"{self.title} - starting {self.start_date} at {self.location}"
```

Dette gjør at vi vil se en instans av Event i Admin panelet som: "Låvefest - starting 2024-13-02 18:00:00+00:00 at Fremmo Gård".

**OBS!** Merk at denne metoden er utenfor Meta klassen.

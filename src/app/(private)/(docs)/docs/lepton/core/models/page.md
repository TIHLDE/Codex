---
title: "Modeller og tabeller i databasen"
---


I "intro til Django" viste vi hvordan en modell er et sett med instrukser som Django bruker for å opprette tabeller i databasen vår. I denne artikkelen skal vi se nærmere på hvordan modeller kan settes opp og hva man kan gjøre.


## Abstrakte modeller

Som nevnt tidligere, har vi 3 modeller i kodebasen vår som alle våre modeller arver fra. Av de 3 er det 2 som man alltid skal arve fra, og en som er valgfri. Alle disse 3 modellene er abstrakte, som vil si at de ikke skal brukes for seg selv, men som en forelder til andre klasser.

### Base Model
```python
class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        abstract = True
```

Denne modellen gjør ikke noe mer spesielt enn å legge til to felter som holder kontroll over dato en instans av tabellen blir laget og når det oppdateres. Dette legges til i instansen automatisk hver gang en instans opprettes eller oppdateres.

### Optional Image (valgfritt bruk)
```python
class OptionalImage(models.Model):
    image = models.URLField(max_length=600, null=True, blank=True)
    image_alt = models.CharField(max_length=200, null=True, blank=True)

    class Meta:
        abstract = True
```

Denne modellen er valgfri og en modell arver fra denne hvis man skal ha et bilde. Et eksempel er Event modellen som arver fra denne for å kunne legge ved et forsidebilde for et Event.

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

Denne modellen er den siste modellen, som i likhet med BaseModel må arves hver gang du oppretter en ny modell. Vårt rettighetssystem er bygget oppå denne modellen. Kort fortalt så sjekker denne modellen om en bruker er en del av en gruppe som har write og read access. Dette tilsier om en bruker har lov til å lage, oppdatere og slette en instans, og om brukeren kan lese instansen. Du kan lese mer om rettighetssystemet [her](https://github.com/lepton/wiki).

### Eksempel
```python
class MyNewModel(BaseModel, BasePermissionModel):
    read_access = (Groups.TIHLDE,)
    write_access = (*AdminGroup.admin(),)
    
    title = models.CharField(max_length=200)
    description = models.TextField(default="", blank=True)

    category = models.ForeignKey(
        Category, blank=True, null=True, default=None, on_delete=models.SET_NULL
    )
```

Her ser vi et eksempel på hvordan man kan opprette en ny modell som overkjører read_access og write_access fra BasePermissionModel. Nå må man være et medlem av TIHLDE (altså innlogget bruker) for å kunne se en eller flere instanser av denne tabellen, og man må være en del av admin-gruppa (HS og Index) for å lage, oppdatere, og slette en instans.

Videre så har vi lagt til en tittel, som er et CharField. Dette betyr at det må være en streng, og den kan være maks 200 bokstaver. Description derimot er et tekstfelt, og har dermed ingen begrensninger på hvor langt det kan være. Vi har satt default til "" og blank til True, som betyr at hvis feltet ikke fylles ut så lagres det som en tom streng.

Til slutt har vi lagt til en fremmednøkkel for category. Dette vil si at vi kan hente ut informasjon om en Category modell fra vår egen modell. Her har vi satt on_delete til models.SET_NULL, som vil si at hvis kategorien slettes, så setter feltet til NULL.

Du kan lese mer om de ulike typene for Fields i [Django sin egen dokumentasjon](https://docs.djangoproject.com/en/5.0/topics/db/models/#fields).

Ellers så er det et godt tips å se på eksisterende modeller for hjelp.

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
Dette gjør at vi vil se en instans av Event i Admin panelet som: "Låvefest - starting 2024-13-02 18:00:00+00:00 at Fremmo Gård"
**OBS!** Merk at denne metoden er utenfor Meta klassen.

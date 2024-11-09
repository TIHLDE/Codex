---
title: 'Hva er Django?'
---

Django er et rammeverk som gjør det for oss som utviklere, lettere å utvikle et REST API. Dette vil
si at vi kan benytte oss av innebygd funksjonalitet til å håndtere forespørsler fra frontend, og
sende tilbake svar på disse forespørslene. Merk at vi kun vil gå kort inn på hovedfunksjonaliteten
her, og at dere må lese videre i resten av dokumentasjonen for mer info.

## Er Django svart magi?

Som ny utvikler i Django sitt økosystem så kan det virke som om django utøver magi. Dette er så
klart ikke sant, men det er derimot mye kode og filer som kjører i bakgrunnen av Django som gjør at
man kan utføre mye funksjonalitet med lite kode. På godt og vondt er dette noe som gjør Django til
et kraftig verktøy, men som kan være forvirrende å forstå og lære.

## Fremgangsmåte

Django sin arkitektur er bygd opp ved det man kaller "apps". Dette vil si at man kan kategorisere
ulike endepunkt i sine egne apps. En app er rett og slett en egen mappe, som inneholder et sett med
egne mapper som har ulike funksjonaliteter.

```yaml
- app
  - content/
  - models/
  - serializers/
  - views/
```

Her ser man et enkelt eksempel på hvordan en app kan se ut. Merk at mappen på rotnivået "app" ikke
er det som er appen vår. App er mappen som vi har resten av prosjektet inni. Her er det mappen "
content" som er vår opprettede app. Det finnes flere mapper og filer i en app, men det kommer vi
tilbake til senere i dokumentasjonen.

### Models

Vi starter med å se på mappen models. Her finner vi alle våre modeller. Vi bruker MySQL som
database, og i MySQL har man et sett med tabeller. En modell er dermed en klasse som definerer
strukturen til en tabell.

```python
from django.db import models

Class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        abstract = True
```

Det vi ser her er vårt første eksempel på en klasse vi har laget selv. Som dere ser så arver
BaseModel Django sin egen klasse Model. For at Django skal kunne bruke filen og klassen til å lage
nye tabeller, må enhver klasse arve denne klassen. Denne klassen gjør at vi kan definere attributter
som skal være en del av vår tabell. Som dere ser i dette eksempelet, så definerer vi to attributter,
created_at og updated_at. Disse er definert som DateTimeField som vil si at de gir oss en dato og
tid. De er også satt til å være automatisk satt til tid med auto_now_add og auto_now. I tillegg kan
de ikke redigeres siden editable er satt til False.

Class Meta er en klasse man plasserer inni klassen og som definerer meta data. Dette kan f.eks. være
i hvilken rekkefølge instanser fra tabellen skal sorteres i, eller som vi ser her at klassen er
abstrakt og skal dermed kun brukes som en foreldreklasse. Alle modeller vi bruker arver fra
BaseModel.
Eksempel:

```python
class News(BaseModel):
    title = models.CharField(max_length=200)
    header = models.CharField(max_length=200)
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="created_news",
    )
    body = models.TextField()
    ...
```

### Serializers

Vi går videre med å se på serializers. Django er et rammeverk der man koder med klasser og objekter.
Dette vil si at når man skal hente ut en instans fra en tabell i databasen, vil man få tilbake denne
instansen som et objekt av modellklassen. Men siden data som sendes over HTTP må sendes som JSON, må
vi ha en måte å konvertere dataen fra objektform til JSON-form. Det er her serializers kommer inn.

```python
class SimpleNewsSerializer(BaseModelSerializer):
    class Meta:
        model = News
        fields = (
            "id",
            "created_at",
            "updated_at",
            "image",
            "image_alt",
            "title",
            "header",
        )
```

**Obs!** Her ser vi at klassen arver fra BaseModelSerializer. Dette fungerer likt som vi viste for
models, men vi kommer tilbake til denne klassen mer detaljert senere.

Her ser vi en klasse av typen serializer, som har en Meta klasse inni seg. For at serializern skal
vite hvilken modell den skal validere dataen opp mot, må man definere modellen. Det som skjer da er
at serializer vil sjekke om de definerte fieldsene er riktig basert på hvordan vi har definert
modellen. Videre vil serializer returnere data i følgende JSON-format:

```json
{
  "id": "1",
  "created_at": "2023-07-15 18:42:30",
  "updated_at": "2023-07-15 18:45:00",
  "image": "https://azure.blob/imageid",
  "image_alt": "Nyhetsbilde",
  "title": "Min nyhet",
  "header": "Nyhet header"
}
```

### Views

Til slutt kommer vi til views mappen. Det er her vi definerer viewsets. Et viewset sin oppgave er å
ta imot en forespørsel, hente ut data ved hjelp av modellen, og returnere serialized data ved hjelp
av en serializer. Det skal dermed bli utført veldig lite logikk og kode i selve viewsetet. Dette
skal gjøres i modellen og serializern. Det er ikke så mye å vise til her, siden de byggeklossene som
et viewset består av, vil vi komme tilbake til i videre dokumentasjon. Det som kan nevnes nå er at
man har primært fem hoved funksjoner, som er følgende:

- list: for å returnere en liste av alle instanser i tabellen. Dette er en GET request.
- retrieve: for å hente en enkel instans basert på id. Dette er en GET request.
- create: for å lage nye instanser. Dette er en POST request.
- update: for å oppdatere en instans. Dette er en PUT request.
- destroy: for å slette en instans. Dette er en DELETE request.

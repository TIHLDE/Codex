---
title: 'Serializere og JSON'
---

I Django refererer en serializer til et verktøy som brukes til å konvertere komplekse datatyper, som modeller og spørringer, til JSON-format som kan sendes via HTTP-forespørsler. Dette gjør det enklere å sende data mellom klienter og servere i en webapplikasjon. Serializers i Django hjelper også til med å validere data før de blir lagret i databasen, og de kan også brukes til å deserialisere data, altså konvertere JSON-data tilbake til Python-objekter. Dette er spesielt nyttig for å håndtere data i API-er.

## Serializer arv

I likhet med modeller har vi en egendefinert klasse som vi arver fra. Denne klassen er valgfri, men er absolutt nødvendig hvis man har en modell som er koblet til en fil. Du kan lese mer om denne klassen og hvordan vi håndterer filopplastning [her.](https://github.com/TIHLDE/Lepton/wiki/Filopplastning)

Det er dermed to måter å definere en serializer klasse på. Enten å arve fra filopplastningklassen slik:

```python
from app.common.serializers import BaseModelSerializer

class MySerializer(BaseModelSerializer):
    ...
```

Eller at man arver fra Django sin BaseModel (vår BaseModelSerializer gjør dette også):

```python
from rest_framework import serializers

class MySerializer(serializers.ModelSerializer):
    ...
```

## Validert data

En av oppgavene til en serializer er å hente inn data som den validerer opp mot en valgt modell. Dette fungerer ved at Django har innebygd funksjonalitet som sjekker om innsendt data er riktig datatyper slik som vi har spesifisert i modellen.

```python
from rest_framework import serializers

class MySerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = (
            "id",
            "title",
            "description"
        )
```

Her ser vi et eksempel på hvordan man velger hvilken model vi skal bruke, og hvilke felter i modellen som skal valideres. Det er ikke alltid vi trenger å validere alle felter fra modellen, men det er viktig å vite at det er kun de spesifiserte feltene som kommer videre. Hvis du fyller inn en body til en POST request med "username" også, vil dette bli filtrert bort etter at den har kjørt gjennom serializern, fordi det ikke er en del av den validerte dataen.

## Utfylling av data fra fremmednøkkel

Slik vi så i eksempelet over validerer data for utvalgte felter fra en modell. Men si vi har en fremmednøkkel til User modellen i vår modell. Da vil user feltet kun returnere id til User.

```python
from rest_framework import serializers

class MySerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)

    class Meta:
        model = MyModel
        fields = (
            "id",
            "title",
            "description",
            "user"
        )
```

I dette tilfellet velger vi å spesifisere at feltet "user" skal hente data fra UserSerializer. Dette vil si at hvis UserSerializer har feltene user_id og first_name definert, vil vi få et JSON objekt med denne dataen.

## Egendefinert felt

Et annet vanlig eksempel er at man ønsker å velge selv hva som skal komme fra et felt. Et eksempel på dette er hvis vi vil at title skal legge ved "Tittel:" på starten av title.

```python
from rest_framework import serializers

class MySerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)
    title = serializers.SerializerMethodField()

    class Meta:
        model = MyModel
        fields = (
            "id",
            "title",
            "description",
            "user"
        )

    def get_title(self, obj):
        return f"Tittel: {obj.title}"
```

Her ser vi hvordan vi kan definere at title skal være en SerializerMethodField. Dette vil si at vi kan lage en funksjon som må ha navnet get\_<feltnavn>. Her kan vi returnere hva som skal vises. Så i vårt tilfelle returnerer vi at title skal returnere en streng med "Tittel:" i starten.

## Ulike typer serializer

Det vi har sett hittil er en serializer som blant annet sjekker id. Men hvis vi skal sende en POST request og lage en ny instans, så genereres id automatisk av databasen. Hvis vi da prøver å sende inn en body uten id, så vil serializern kaste en feil om at det mangler data. Derfor lager vi en egen serializer for hver type operasjon (retrieve, list, create, update) vi bruker. Når du ser rundt i kodebasen vår så vil du se at ikke alle gjør det, og at en del slår sammen update og create. Dette vil i mange tilfeller gå, men er dårlig kodestil og følger ikke vår konvensjon. Derfor er det viktig at dere gjør det på måten som vises nå.

### Update

```python
from rest_framework import serializers

class MyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = (
            "title",
            "description"
        )

    def update(self, instance, validated_data):
        # Utfør kode her hvis nødvendig
        return super().update(instance, validated_data)
```

Her ser vi et eksempel på en Update serializer som blir brukt når det kommer inn PUT requests. Denne trenger ikke id, siden objektet blir sendt inn i viewsettet (dette kan leses om i dokumentasjonen om viewsets). Her ser vi også at det er definert en update metode. I de fleste tilfeller trenger man ikke å definere denne metoden siden den kjører automatisk. Men hvis det er noe som må endres på eller gjøres før man oppdaterer instansen i databasen må update metoden overkjøres. Men da er det viktig å huske på å returnere super-metoden til slutt.

Merk at validated_data er data som er validert (som beskrevet tidligere). Dette er alle feltene som har blitt validert.

### Create

```python
from rest_framework import serializers

class MyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = (
            "title",
            "description"
        )

    def create(self, validated_data):
        # Utfør kode her hvis nødvendig
        return super().create(validated_data)
```

Her ser vi et eksempel på en Create serializer. Dette funker likt som i update, bare at det ikke sendes med et objekt (instance i update), siden det ikke finnes noe enda.

### List

```python
from rest_framework import serializers

class MyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = (
            "title",
            "description"
        )
```

Her ser vi et eksempel på en serializer for en GET request som skal liste opp flere instanser. Denne vil du at ikke skal ha så mye data, siden den henter mange instanser, og det er sjeldent at man trenger mye info for opplistning av instanser. Merk at det ikke er noe behov for noen create eller update metode her siden ingenting skal lages eller oppdateres. Denne er kun for å få ut hvilken JSON data som skal returneres som response.

### Retrieve

```python
from rest_framework import serializers

class MySerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = (
            "title",
            "description",
            ...
        )
```

Her ser vi et eksempel på en serializer for en GET request som skal liste opp detaljert info om en instans. Derfor er det vanlig her at man sender med mye mer data. Merk også at her gir man navnet til serializern ikke noe mer info, siden dette er vår default serializer.

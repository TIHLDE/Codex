---
title: "Viewsets og Responser"
---

I Django er ViewSets en del av Django REST Framework, som er et verktøysett for å lage RESTful API-er i Django. ViewSets er en praktisk måte å organisere visninger (views) for API-er på, og de tilbyr en abstraksjon som gjør det enkelt å definere vanlige CRUD-operasjoner (Create, Read, Update, Delete) for ressurser.

## BaseViewSet
I likhet med models og serializers har vi en baseclass som skal være med i alle viewsets vi lager.

```python
from rest_framework import viewsets

from app.common.mixins import LoggingViewSetMixin


class BaseViewSet(LoggingViewSetMixin, viewsets.ModelViewSet):
    pass
```

Denne gjør ingenting mer enn å arve viewsets.ModelViewSet (Django sin egen klasse) og LoggingViewSetMixin.

```python
class LoggingViewSetMixin(LoggingMethodMixin):
    def perform_create(self, serializer, *args, **kwargs):
        """Create an object and log its data."""
        instance = serializer.save(*args, **kwargs)
        self._log_on_create(serializer)
        return instance

    def perform_update(self, serializer, *args, **kwargs):
        """Update the instance and log the updated data."""
        self._log_on_update(serializer)
        instance = serializer.save(*args, **kwargs)
        return instance

    def perform_destroy(self, instance):
        """Delete the instance and log the deletion."""
        self._log_on_destroy(instance)
        instance.delete()
```
Denne klassen er viktig å ha med siden den gir oss mulighet for automatisk logging av handlinger brukere utfører. Dette gir oss i Index mulighet til å se om noen misbruker rettighetene sine.

Vi har også følgende metode:
```python
class ActionMixin:
    def paginate_response(self, data, serializer, context=None):
        page = self.paginate_queryset(data)
        serializer = serializer(page, many=True, context=context)
        return self.get_paginated_response(serializer.data)
```

Denne modellen arves slik at vi kan benytte oss av pagination. Pagination er at vi kan dele opp en response i sider, slik at vi ikke returnerer veldig store mengder data på en gang. Dette kan du lese mer om i seksjonen om *Pagination*. 

## Oppsett
```python
from app.common.viewsets import BaseViewSet
from app.common.mixins import ActionMixin

class MyViewSet(BaseViewSet, ActionMixin):
    serializer_class = MySerializer
    permission_classes = [BasicViewPermission]
    queryset = MyModel.objects.all()
    pagination_class = BasePagination
```
Her ser vi hvordan vi setter opp atributter i et viewset:

* Vi definerer en klasse med følgende konvensjon: *\<Modellnavn>ViewSet*.
* Vi arver de to klassene *BaseViewSet* og *ActionMixin* som vi har nevnt over.
* serializer_class: Her sender vi inn hvilke serializer vi vil bruke som default. Ønsker man å gjøre dette valget dynamisk basert på vilkår kan man bruke metoden get_serializer(self). Ethvert viewset må ha enten serializer definert som variabel eller en metode som returnerer viewsetet. Hvis ikke vil Django kaste en feil.
* permission_classes: Her ser vi at vi setter inn vår egendefinerte permission class. Denne MÅ være med, og en forklaring på hvorfor kan du lese om i egen dokumentasjon om rettighetssystemet.
* queryset: Dette definerer hvilke data vi ønsker å sende ut som default. Vi kommer tilbake til et eksempel senere.
* pagination_class: Dette er klassen som definerer hvordan vi skal håndtere Pagination. Denne trenger ikke å være med hvis man ikke skal benytte seg av pagination. Men i de fleste tilfeller ønkser vi pagination.


## Crud
Videre skal vi se på hvordan man setter opp de ulike CRUD endepunketene. En viktig bemerkelse for Django er at de nevnte metodene MÅ bli definert med riktige navn på metodene. Eller så vil ikke Django klare å benytte riktige metoder når frontend kaller på de ulike endepunktene.

### GET - list
```python
    def list(self, request, *args, **kwargs):
        # Denne brukes sjeldent, og vi kommer tilbake
        # til den i seksjonen om Pagination.
```
Her ser vi hvilken metode man bruker for å lage en GET request som henter ut flere instanser. Et eksempel er hvordan man kan se en liste over arrangementer på TIHLDE siden. Vi kommer tilbake til dette under *Pagination* seksjonen siden vi lar Django og definerte klasser (nevnt over) håndtere dette for oss.

### GET - retrieve
```python
    def retrieve(self, request, pk):
        try:
            my_instance = self.get_object()
            serializer = MySerializer(
                my_instance,
                context={"request": request},
                many=False
            )
            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
        except MyModel.DoesNotExist as my_instance_not_exists:
            return Response(
                {"detail": "Fant ikke instans"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception:
            return Response(
                {"detail": "Det skjedde en feil på serveren"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

Her ser vi hvilken metode man bruker for å håndtere en GET request som spør etter èn spesifikk instans. Et typisk kall vil se slik ut fra frontend:

```js
const response = await fetch(
    "GET",
    "https://api.tihlde.org/my_endpoint/1"
)
```

Det vil si at enhver GET forespørsel som spør etter en spesifikk instans med en gitt ID fra url'en vil bli navigert til vår **retrieve** metode. Som vi ser i eksempelet er det definert et argument **pk**, som står for primary key. Det vil si ID'en til instansen som blir sendt i url'en (1 i dette tilfellet). Som vist i eksempelet over blir ikke PK brukt (men det må fortsatt defineres), og det er en årsak til dette:

```python
# Den tungvinte måten å hente en instans på

# Henter ut instansen manuelt ved hjelp av ORM
my_instance = MyModel.filter(id=pk).first()

# Hvis ikke instansen finnnes så returnerer man 
# en 404 status kode
if my_instance == None:
    return Response(
        {"detail": "Fant ikke instans"},
        status=status.HTTP_404_NOT_FOUND
    )


# Den lettvinte metoden som skjer
# bak kulissene i Django
try:
    my_instance = self.get_object()
except MyModel.DoesNotExist as my_instance_not_exists:
    return Response(
        {"detail": "Fant ikke instans"},
        status=status.HTTP_404_NOT_FOUND,
    )
```

Det finnes eksempler hvor man har behov for **PK** utenom å hente ut selve instansen. Men hvis alt du trenger å gjøre er å hente ut instansen, så er det best å benytte self.get_object().

Videre ser vi hvordan man benytter en Serializer, som er nevnt i en tidligere seksjon. Som vi husker fra seksjonen om Serializer, så konverterer den vår instans om til JSON.

```python
serializer = MySerializer(
    my_instance,
    context={"request": request},
    many=False
)
return Response(
    serializer.data,
    status=status.HTTP_200_OK
)
```

Når man benytter en serializer for å omgjøre kun èn instans om til JSON, er det nødvendig å sende inn instansen som første parameter i MySerializer. Deretter sender man inn en context, som er et nøkkelverdipar med request som kommer fra retrieve argumentene. Til slutt setter vi **many** til False siden vi kun ønsker èn instans. Det vi sender tilbake til frontend som har gjort denne forespørselen er da serializer.data som vil være et JSON objekt.


### POST
```python
    def create(self, request, *args, **kwargs):
        try:
            data = request.data
            create_serializer = MyCreateSerializer(
                data=data,
                context={"request": request}
            )
            if serializer.is_valid():
                my_new_instance = super().perform_create(create_serializer)
                serializer = MySerializer(my_new_instance)
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED
                )

            return Response(
                {"detail": create_serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            return Response(
                {"detail": "Det skjedde en feil på serveren"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

Her ser vi hvordan vi lager en metode for å håndtere en **POST** forespørsel. Dette er en nokså generisk fremgangsmåte som vil være ganske lik for de aller fleste tilfeller. I noen tilfeller vil det være behov for å legge til mer kode. Et eksempel vil man se i seksjonen om hvordan vi benytter oss av Vipps for betaling. Men alt som omgår oppretting av instanser i vår database skjer på grunn av denne koden.

Det første steget er å hente ut data som blir sendt med POST forespørselen. Deretter sender vi denne data'en inn i vår CreateSerializer som sjekker om nødvendig data er sendt med forespørselen. Hvis dette er riktig, som blir sjekket med is_valid() metoden, så oppretter vi en ny instans. Denne instansen må i likhet med **retrieve** metoden konverteres til JSON. Dette gjør vi med å kalle på vår default Serializer som gir oss vår instans som et JSON objekt. Dette sender vi deretter tilbake til frontend, sammen med statuskode 201.

Hvis data som blir sendt ikke er riktig, eller har mangler, så sender vi tilbake en statuskode på 400 og create_serializer.errors. Dette vil være en liste over hvilke feil og mangler som er i innsendt data.


### PUT
```python
    def update(self, request, *args, **kwargs):
        try:
            data = request.data
            my_instance = self.get_object()
            update_serializer = MyUpdateSerializer(
                my_instance,
                data=data,
                context={"request": request}
            )
            if update_serializer.is_valid():
                my_updated_instance = super().perform_update(
                    update_serializer
                )
                serializer = MySerializer(my_updated_instance)
                return Response(
                    serializer.data,
                    status=status.HTTP_200_OK
                )

            return Response(
                {"detail": update_serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except MyModel.DoesNotExist as my_instance_not_exists:
            return Response(
                {"detail": "Fant ikke instans"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception:
            return Response(
                {"detail": "Det skjedde en feil på serveren"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

Her ser vi hvordan man lager en metode for å oppdatere en instans. Dette er veldig likt som i en **create (POST)** metode. Eneste forskjellen er at man istedenfor å lage en ny instans så henter man den eksisterende instansen ved hjelp av self.get_object(). Deretter følger samme logikk ved at innsendt data blir validert og at instansen blir oppdatert og sendt tilbake til frontend med statuskode 200.


### DELETE
```python
    def destroy(self, request, *args, **kwargs):
        try:
            super().destroy(request, *args, **kwargs)
            return Response(
                {"detail": "Instansen ble slettet"},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"detail": "Det skjedde en feil på serveren"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

Her ser man hvordan man håndterer sletting av en instans. Som man ser så er det veldig enkelt, og ved første øyekast kan det se ut som at alt man gjør er å kalle på foreldermetoden. Slik klasser fungerer, så vil destroy allerede være en eksisterende metode som ikke trenger å bli definert på nytt. MEN likevel så gjør vi det? Dette kommer av statuskoden vi sender tilbake til frontend. En **DELETE** forespørsel sender statuskode 204 tilbake hvis den lykkes. Men i vår frontend (Kvark) så har vi ikke tatt høyde fra at 204 er en mulig statuskode, og frontend håndterer dette som en feil selvom det ikke er det. Så klart er det beste å gjøre her, å fikse opp i denne feilen på frontend, men uansett så fortsetter vi å skrive våre destroy metoder på denne måten.


### Noen siste bemerkninger
Vi har nå gjennomgått standard endepunkter for et ViewSet. Det er flere vi skal gå gjennom i en senere seksjon. Men noe vi vil bemerke er bruken vår av try og except. Hvis vi ikke bruker dette, så vil en potensiell feil på serveren ikke gi noe logisk respons til frontend, og dette gjør det vanskelig å debugge. Dermed er det viktig at vi håndterer alle mulige feil, slik at backend får sendt tilbake en logisk respons til frontend slik at det er lettere å forstå feilen.
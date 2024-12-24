---
title: 'Et lite eksempel'
---

Vi anbefaler deg å starte med å lese gjennom dette eksempelet før du går videre til de andre seksjonene. Dette eksempelet vil gi deg en grunnleggende forståelse av hvordan vi bruker Django og DRF til å lage RESTful API-er for Lepton. Dette vil gjøre det lettere for deg å forstå de mer avanserte emnene som vi dekker senere i dokumentasjonen.

## Introduksjon

I dette eksempelet skal vi lage et enkelt RESTful API for deler av en bok-applikasjon. Vi vil bruke Django og Django REST Framework (DRF) til å lage API-en. Vi vil dekke emner som:

- **Modeller og Spørringssett**: Hvordan vi bruker modeller og spørringssett (ORM) til å samhandle med databasen vår.
- **Serializers**: Hvordan vi bruker serializers til å konvertere data mellom våre modeller og JSON.
- **Viewsets og Routers**: Hvordan vi bruker viewsets og routers til å definere API-endepunkter og URL-ruter.

## Oppsett av modeller

Vi starter med å opprette modellene for bok-applikasjonen vår. Vi vil ha to modeller: **Forfatter** og **Bok**. Forfatteren kan ha flere bøker. Vi vil også legge til noen attributter for hver modell.

```python
from app.util.models import BaseModel
# BaseModel er en klasse som vi har laget for å legge til
# attributtene created_at og updated_at til alle modellene våre


class Author(BaseModel):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)

    class Meta:
        ordering = ("last_name", "first_name")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Book(BaseModel):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True)
    publication_date = models.DateField()
    isbn = models.CharField(max_length=20, unique=True)

    class Meta:
        ordering = ("title",)

    def __str__(self):
        return self.title
```

### Hva gjør koden over?

- Vi har opprettet to modeller: **Author** og **Book**.
- Begge modellene arver **BaseModel**, som legger til **created_at** og **updated_at** som ekstra attributter.
- **Author**-modellen har attributtene **first_name**, **last_name**, **phone_number** og **email**. Dette er verdiene som blir lagret for hver rad i vår database.
- **Book**-modellen har attributtene **title**, **author**, **publication_date** og **isbn**.
- Du har kanskje lagt merke til at ingen av modellene har en definert id? Django autogenerer en inkrementell tall-id ved attributt-navn **id**, hvis man selv ikke definerer noen primærnøkkel.
- Begge modellene har en **Meta**-klasse som gir oss muligheten til å definere innstillinger for modellen. I vårt tilfelle har vi anvendt **ordering**, som bestemmer hvordan vi skal sortere data som vi henter ut.
- Begge modellene har en **str**-metode som definerer hvordan en instans av modellen representeres. Dette vil du lære mer om i dokumentasjonen om admin-panelet til Django.

## Oppsett av Serializers

Neste steg er å opprette serializers for våre modeller. Serializers brukes til å konvertere data mellom JSON og våre modeller. Vi vil opprette to serializers: **AuthorSerializer** og **BookSerializer**.

```python
from app.common.serializers import BaseModelSerializer
from app.book.models import Author, Book


class AuthorSerializer(BaseModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"
        # __all__ betyr at vi inkluderer alle attributtene i serializeren
    

class BookSerializer(BaseModelSerializer):
    author = AuthorSerializer(many=False, read_only=True)

    class Meta:
        model = Book
        fields = (
            "id",
            "title",
            "author",
            "publication_date",
            "isbn",
            "created_at",
            "updated_at",
        )
```

### Hva gjør koden over?

- Vi har opprettet to serializers: **AuthorSerializer** og **BookSerializer**.
- **AuthorSerializer** har en **Meta**-klasse som definerer modellen som serializeren skal bruke, og hvilke attributter som skal inkluderes i serializeren.
- Vi har også inkludert **AuthorSerializer** som et felt i **BookSerializer**. Dette gjør at vi kan inkludere data om forfatteren når vi henter ut data om en bok. Hvis vi ikke hadde inkludert dette feltet, ville vi bare fått en id for forfatteren.

Oppsummert betyr dette at når vi henter ut en eller flere instanser av **Book** eller **Author**, vil vi få tilbake JSON-data som inkluderer alle attributtene for hver modell. Eksempel på JSON-data for en bok:

```json
{
    "id": 1,
    "title": "The Great Gatsby",
    "author": {
        "id": 1,
        "first_name": "F. Scott",
        "last_name": "Fitzgerald",
        "phone_number": "12345678",
        "email": "f.scott@fitzgerald.com",
        "created_at": "2022-01-01T00:00:00Z",
        "updated_at": "2022-01-01T00:00:00Z"
    },
    "publication_date": "2022-01-01",
    "isbn": "978-3-16-148410-0",
    "created_at": "2022-01-01T00:00",
    "updated_at": "2022-01-01T00:00"
}
```


## Oppsett av Viewsets

Neste steg er å opprette viewsets for våre modeller. Viewsets brukes til å definere API-endepunkter og URL-ruter. Vi vil opprette to viewsets: **AuthorViewSet** og **BookViewSet**.

```python
from app.common.pagination import BasePagination
from app.common.viewsets import BaseViewSet
from app.book.models import Author, Book
from app.book.serializers import AuthorSerializer, BookSerializer


class AuthorViewSet(BaseViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    pagination_class = BasePagination


class BookViewSet(BaseViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = BasePagination
```

### Hva gjør koden over?

- Vi har opprettet to viewsets: **AuthorViewSet** og **BookViewSet**.
- Begge viewsets arver **BaseViewSet**, som selv arver DRF sin viewsetklasse, samt en egendefinert klasse vi har for logging.
- Vi har satt **queryset** til å hente ut alle instanser av **Author** og **Book**.
- Vi har satt **serializer_class** til å bruke **AuthorSerializer** og **BookSerializer**.
- Vi har satt **pagination_class** til å bruke **BasePagination**. Dette vil gi oss paginering for API-endepunktene våre.

## Oppsett av URL-ruter

Siste steg er å opprette URL-ruter for API-endepunktene våre. Vi vil bruke DRF sin **router** for å gjøre dette.

```python
from django.urls import include, re_path
from rest_framework import routers

from app.book.views import AuthorViewSet, BookViewSet

router = routers.DefaultRouter()

router.register("authors", AuthorViewSet)
router.register("books", BookViewSet)

urlpatterns = [re_path(r"", include(router.urls))]
```

### Hva gjør koden over?

- Vi har opprettet en **router** ved hjelp av DRF sin **DefaultRouter**.
- Vi har registrert **AuthorViewSet** og **BookViewSet** med routeren.
- Vi har lagt til URL-ruter for API-endepunktene våre ved å inkludere routerens URL-ruter i **urlpatterns**.

## Våre API-endepunkter

Nå har vi satt opp API-endepunkter for å hente ut data om forfattere og bøker. Her er en oversikt over API-endepunktene våre:

### GET
- **/authors/**: Henter ut alle forfattere.
- **/authors/{id}/**: Henter ut en spesifikk forfatter.
- **/books/**: Henter ut alle bøker.
- **/books/{id}/**: Henter ut en spesifikk bok.

### POST
- **/authors/**: Oppretter en ny forfatter.
- **/books/**: Oppretter en ny bok.

### PUT
- **/authors/{id}/**: Oppdaterer en spesifikk forfatter.
- **/books/{id}/**: Oppdaterer en spesifikk bok.

### DELETE
- **/authors/{id}/**: Sletter en spesifikk forfatter.
- **/books/{id}/**: Sletter en spesifikk bok.


## Oppsummert

I dette eksempelet har vi satt opp et enkelt RESTful API for en bok-applikasjon ved hjelp av Django og DRF. Vi har dekket emner som modeller, serializers, viewsets, URL-ruter og API-endepunkter. Dette er en god start for å forstå hvordan vi bruker Django og DRF til å lage API-er for Lepton. Vi anbefaler deg å lese videre i dokumentasjonen for å lære mer om avanserte emner som autentisering, autorisasjon, testing og mye mer.
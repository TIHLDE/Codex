---
title: 'Viewsets, filtrering og søk'
---

I seksjonen **_Viewsets og responser_** har vi sett på hvordan et basic ViewSet settes opp med arv, attributter og metoder for CRUD. I denne seksjonen skal vi se nærmere på hvordan vi kan filtrere data ut ifra en url som sendes som en forespørsel fra frontend. I denne seksjonen skal vi bruke Codex sine møtedokumenter (eng. minute) som et eksempel.

## Hvordan URL filtrering fungerer

Når en forespørsel sendes til Lepton for å hente ut møtedokumenter for medlemmer av Codex kan vi sende en slik forespørsel i frontend:

```js
const response = await fetch('https://api.tihlde.org/minutes/');
```

Dette vil kalle på vår list metode som vil returnere en liste møtedokumenter basert på en sortering som vi har bestemt (typisk fra mest nylig opprettet og nedover).

Men våre møtedokuementer har ulike tags basert på om det er et møtedokument eller et vanlig dokument som kan inneholde annen informasjon. Så hva hvis vi kun ønsker å sortere basert på tags, eller har lyst til å søke etter etter hvilke dokumenter et spesifikt medlem av Codex har lastet opp?

Det er her URL filtrering kommer inn. Dette er en velkjent logikk som de aller fleste backend systemer og rammeverk benytter seg av. Hvis vi ønsker å hente ut dokumenter som er skrevet av medlemmet Elon Musk og som er sortert etter tag kunne vi sendt en slik forespørsel:

```js
const response = await fetch(
  'https://api.tihlde.org/minutes/?search=Musk&sortBy=tag',
);
```

Her ser man hvordan man bruker URL'en og spesialtegn som ? og & for å legge til det vi kaller queries. Her sier vi ifra til backend at vi kun ønsker resultater som er skrevet av en forfatter som inneholder navnet Musk og som skal være sortert etter hvilken tag det er.

## Hvordan gjør vi dette i Django?

Det er ikke alle rammeverk som har egne metoder innebygd for å håndtere sortering like enkelt som Django. For eksempel i JavaScript backend rammeverket Express må man skrive en egen logikk for å søke i databasen basert på disse kriteriene som blir sendt via URL'en.

Men i Django har man egne klasser man kan benytte for å håndtere dette.

```python
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from app.common.viewsets import BaseViewSet
from app.content.filters import MinuteFilter
...

class MinuteViewSet(BaseViewSet):
    ...

    # Viktig å legge til disse to attributtene
    # Hvis ikke så vil ikke Django håndtere søk og filtrering
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter
    ]
    filterset_class = MinuteFilter
    search_fields = [
        "title",
        "author__first_name", # Peker til fremmednøkkel
        "author__last_name",
        "author__user_id",
    ]

    ...
```

Her ser vi et eksempel på deler av en ViewSet klasse som håndterer forespørsler om møtedokumenter. Det første steget for å implementere filtrering og søk, er attributtet **_filter_backends_**. Her legger vi til et par klasser som vi ikke har skrevet selv, men som følger med pakker tilknyttet Django. Hvis du ønsker å lære mer om disse, så kan man enten gå inn i en IDE som VSCode og trykke på klassen for å lese selve koden, eller så kan [lese mer om det her](https://www.django-rest-framework.org/api-guide/filtering).

Men enkelt forklart så er det to metoder som lar deg sette en **_filterset_class_** og **_search_fields_** og deretter håndterer logikken for deg.

### Søk

Vi kan starte med det enkleste først, nemlig søk. Ved å fylle inn en liste med strenger i search_fields, vil Django automatisk håndtere forespørsler til databasen basert på gitte søkekriterier. Siden Django bruker klasser og objekter som logikk i sitt rammeverk, så håndterer man fremmednøkler med dobbel understrek (\_\_) for å velge ut attributter til fremmednøkkel objektet. I vårt eksempel vil author være en fremmednøkkel til User modellen, og for at man skal kunne søke etter fornavn, etternavn og id (brukernavn) så må man skrive author\_\_\<attributt>. Ved hjelp av disse kriteriene og search=\<verdi> i URL'en, vil filters.SearchFilter klassen håndtere søk opp mot databasen ved hjelp av Django sin ORM.

## Filter

Her er det DjangoFilterBackend klassen som styrer logikken. I tillegg så må vi lage vår egen klasse som vi plasserer som verdi til attributtet filterset_class. På denne måten kan vi styre hvordan vi ønsker å filtrere basert på ulike queries i URL'en.

```python
from django_filters.rest_framework import (
    FilterSet,
    OrderingFilter
)

from app.content.models import Minute


class MinuteFilter(FilterSet):
    """Filters minutes"""

    ordering = OrderingFilter(
        fields=(
            "created_at",
            "updated_at",
            "title",
            "author",
            "tag"
        )
    )

    class Meta:
        model = Minute
        fields = ["author", "title", "tag"]
```

Dette er et ganske enkelt eksempel på hvordan man kan lage en Filter klasse som arver fra FilterSet som er definert av en Django pakke. Her gjør vi ikke noe mer komplisert enn å definere at vi vil kunne sortere (ved bruk av OrderingFilter) basert på et sett med gitt attributter. I tillegg må vi definere en innvending Meta klasse som definerer hvilken modell og _fields_ vi skal bruke. Siden created_at og updated_at blir lagt til på alle modeller som en default av Django så trenger ikke det å legges til.

Det kan derimot bli laget mye mer avanserte filtere, som vi kan se her for en modell Badge som håndterer badges som brukere av TIHLDE kan få på nettsiden:

```python
from django_filters import filters


class UserWithBadgesFilter(FilterSet):
    study = filters.CharFilter(
        method="filter_is_in_study",
        label="Only list users in study"
    )
    studyyear = filters.CharFilter(
        method="filter_is_in_studyyear",
        label="Only list users in studyyear"
    )

    category = filters.ModelChoiceFilter(
        method="filter_category",
        field_name="category",
        queryset=BadgeCategory.objects.all(),
    )

    def filter_category(self, queryset, name, value):
        return queryset.filter(
            user_badges__badge__badge_category=value
        )

    def filter_is_in_study(self, queryset, name, value):
        return queryset.filter(
            memberships__group__slug=value,
            memberships__group__type=GroupType.STUDY
        )

    def filter_is_in_studyyear(self, queryset, name, value):
        return queryset.filter(
            memberships__group__slug=value,
            memberships__group__type=GroupType.STUDYYEAR
        )

    class Meta:
        model = User
        fields = [
            "studyyear",
            "study",
            "category",
        ]
```

Her ser vi et eksempel på hvordan man kan importere filters som inneholder flere klasser som definerer hva slags filter man vil bruke. Ønsker man å filtrere basert på en tekststreng som kommer i URL'en så man bruke CharFilter. Hvis man derimot ønsker å filtrere basert på en annen modell så bruker man ModelChoiceFilter. Likheten for alle filtermetodene er at man må definere en funksjon som returnerer resultatet fra filtreringen. Dette er altså en måte å få mer kontroll over logikken selv, og det krever kunnskap om hvordan Django sin ORM fungerer. Man kan [lese mer om de ulike filtermetodene her](https://django-filter.readthedocs.io/en/stable/ref/filters.html).

## Hvordan filtrering ikke skal gjøres

Hvis man åpner Lepton kodebasen og navigerer seg til Event sitt ViewSet så vil man se mange linjer med kode som håndterer filtrering inni selve ViewSetet. Dette er et typisk eksempel på techdebt som burde rettes opp. Her er det snakk om hvordan mange linjer med kode og mye If-sjekker kan skrives med færre linger og mer elegant med en Filter klasse.

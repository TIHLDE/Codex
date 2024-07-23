---
title: "Viewsets og paginering"
---

I seksjonen ***Viewsets og responser*** har vi sett på hvordan et basic ViewSet settes opp med arv, attributter og metoder for CRUD. I denne seksjonen skal vi se nærmere på hvordan vi kan paginere en respons. Det vil altså si at vi deler opp antall instanser vi sender tilbake til frontend i oppdelte sider på et x antall instanser. Dette gjør vi for å forhindre å sende store mengder data som fører til  større kostnader for TIHLDE og tregere responser sendt til frontend.

## Hvordan URL paginering fungerer
I likhet med filtering og søk er det URL'en til forespørselen man benytter seg av for å paginere. En typisk forespørsel kan dermed se slik ut:

```js
const response = await fetch(
    "https://api.tihlde.org/minutes/?count=25&page=3"
)
```

Her sier vi ved hjelp av URL'en at vi ønsker hente ut 25 instanser på side nummer 3. Det vil altså si at vi ønsker alle instanser som er fra og med 51 til og med 75. Igjen så er det logikk i Django og støttende pakker som utfører denne logikken for oss.

## ActionMixin (mulig techdebt)
I seksjonen ***Viewsets og responser*** ble det nevnt at klassen ActionMixin arves i et ViewSet for å åpne for paginering. Dette er derimot en mulig techdebt, altså kode som er skrevet og ikke fikset opp i senere tid. Ved å søke på denne klassen i kodebasen vil man finne flere eksempeler på ViewSets som benytter seg av denne. Men derimot så har vi en annen metode som vi heller bruker som håndterer ActionMixin sin funksjonalitet for oss.

```python
class ActionMixin:
    def paginate_response(self, data, serializer, context=None):
        page = self.paginate_queryset(data)
        serializer = serializer(page, many=True, context=context)
        return self.get_paginated_response(serializer.data)
```

Det klassen i bunn og grunn gir oss, er en metode for å returne en paginert respons. Den benyttes typisk på følgende måte:

```python
return self.paginate_response(
    data=events, 
    serializer=EventListSerializer, 
    context={"request": request}
)
```

Dette er dermed en måte å sende tilbake en respons med paginering. Heldigvis er det kun 3 klasser som benytter seg av denne metoden. Vi ønsker derimot ikke mer bruk av denne metoden, for å opprettholde god kodestil.

## BasePagination (den riktige metoden)
Det vi derimot benytter oss av er ***BasePagination*** klassen i attributtet pagination_class i ViewSet klassen. Ved bruk av èn enkelt linje med kode så kan vi returnere Respons klassen på vanlig måte som vist i andre seksjoner, og i tillegg få med paginerings informasjon.

```python
from collections import OrderedDict

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class BasePagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = "None"

    def get_paginated_response(self, data):
        return Response(
            OrderedDict(
                [
                    ("count", self.page.paginator.count),
                    ("next", self.get_next_page()),
                    ("previous", self.get_previous_page()),
                    ("results", data),
                ]
            )
        )

    def get_next_page(self):
        if not self.page.has_next():
            return None
        return self.page.next_page_number()

    def get_previous_page(self):
        if not self.page.has_previous():
            return None
        return self.page.previous_page_number()
```

Det BasePagination klassen gjør er ån arve fra DRF sin PageNumberPagination klasse som håndterer paginering. Men det vi derimot får konfigurert er hvor mange instanser vi ønsker at hver siden skal maks inneholde (satt til 25) og hvordan vår respons skal bli returnert. I dette tilfellet ser man at vi returnerer nøklene count, next, previous og results, som gir oss selve resultatene og informasjon om antall instanser, hva som er URL til neste og forrige side.

OBS! page_size_query_param er satt til "None", som vil si at det ikke er mulig å overkjøre antall sider ved hjelp av en URL query. Det kan vurderes om dette burde endres, men standardisering er ofte bra å følge.

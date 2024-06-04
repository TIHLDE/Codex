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

Denne modellen arves slik at vi kan benytte oss av pagination. Pagination er at vi kan dele opp en response i sider, slik at vi ikke returnerer veldig store mengder data på en gang.

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
Her ser vi hvordan vi setter opp et viewset:

* serializer_class: Her sender vi inn hvilke serializer vi vil bruke som default. Ønsker man å gjøre dette valget dynamisk basert på vilkår kan man bruke metoden get_serializer(self). Ethvert viewset må ha enten serializer definert som variabel eller en metode som returnerer viewsetet.
* permission_classes: Her ser vi at vi setter inn vår egendefinerte permission class. Denne MÅ være med, og en forklaring på hvorfor kan du lese om i egen dokumentasjon om rettighetssystemet.
* queryset: 
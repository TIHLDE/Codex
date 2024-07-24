---
title: "Hvordan sette opp URL for et endepunkt"
---

Når du har kodet ferdig et viewset må du bestemme hvilken url man skal kalle på for å komme til de ulike endepunktene du har laget for viewsettet. Dette gjør man ved å opprette en urls.py fil i **appen**. 

```python
from django.urls import include, path, re_path
from rest_framework import routers

from app.content.views import (
    ToddelViewSet,
    ...
)

router = routers.DefaultRouter()

router.register("toddel", ToddelViewSet)

urlpatterns = [
    re_path(r"", include(router.urls))
]
```

Her lager vi en instans av DRF sin **DefaultRouter**. Her kan vi registrere alle våre viewsets fra vår **app** og bestemme navnet på endepunktet.

Til slutt blir disse registrert i **urlpatterns**. Denne listen sender vi inn i urls.py på root nivå.

{% callout title="re_path" %}
re_path står for **Regex path**, og årsaken til at vi bruker dette, er fordi noen ganger så registrerer vi viewsets i vår **router** som benytter seg av regex for å f.eks. legge til en ekstra id i url'en.

Dermed benytter vi oss av **re_path** istedenfor den vanlige **path**, for å unngå trøbbel hvis noen legger til et viewset som har behov for regex.
{% /callout %}

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("rest_framework.urls")),
    # Our endpoints
    path("", include("app.career.urls")),
    path("", include("app.communication.urls")),
    path("", include("app.content.urls")),
    path("", include("app.group.urls")),
    path("", include("app.payment.urls")),
    path("auth/", include("app.authentication.urls")),
    path("badges/", include("app.badge.urls")),
    path("forms/", include("app.forms.urls")),
    path("galleries/", include("app.gallery.urls")),
    path("badges/", include("app.badge.urls")),
    path("kontres/", include("app.kontres.urls")),
    path("emojis/", include("app.emoji.urls")),
]
```

I vår eksempel med Toddel, så blir endepunktet man kaller på for **ToddelViewSet**: https://api.tihlde.org/toddel/.


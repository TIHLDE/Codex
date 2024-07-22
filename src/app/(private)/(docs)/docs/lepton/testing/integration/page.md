---
title: Integrasjonstester
---

Integrasjonstester er også mye av det samme vi har gått gjennom. Men det er litt ekstra oppsett vi skal gjennom for å legge til rette for testingen. Vi følger også her et eksempel.

Vi skal nå teste muligheten for å lage en blogg som vi har vist i andre eksempler. Vi vil at kun HS og undergrupper skal ha mulighet til å lage en blogg. Det første vi må gjøre er på opprette en **test_blog_integration.py** fil under **app/tests**.

Deretter setter vi inn følgende i toppen av filen:

```python
import pytest

from rest_framework import status
from app.tests.conftest import _add_user_to_group
from app.util.test_utils import get_api_client,

... # Andre imports


API_BLOGS_BASE_URL = "/blogs/"

def get_blogs_url_detail(blog=None):
    return f"{API_BLOGS_BASE_URL}{blog.id}/"

def get_blog_data(
    title="New Title",
    description="New Description",
):
    data = {
        "title": title,
        "description": description
    }

    return data
```

Her ser vi først noen **imports** som de aller fleste integrasjonstester er avhengige av:

* **pytest**: For å sette opp selve testene.
* **status**: Enum for å hente ulike responskoder.
* **_add_user_to_group**: En metode vi har for å legge en bruker til en spesifikk gruppe.
* **get_api_client**: En metode vi har for å opprette en fake klient for å sende en forespørsel til vårt endepunkt med bruker sin token sendt med for å verifisere seg.

Videre har vi en konstant og to metoder:

* **API_BLOGS_BASE_URL**: Base url, kommer til å bruke denne mye.
* **get_blogs_url_detail**: Hente ut url for en spesifikk blogg for oppdatering og sletting.
* **get_blog_data**: Hente ut data som skal sendes i en forespørsel for å opprette eller oppdatere en blogg.


Videre så må vi sette opp selve testen:

```python
@pytest.mark.django_db
@pytest.mark.parametrize(
    "group_name, excpected_status_code", 
    [
        *[
            (group, staus.HTTP_200_OK)
            for group in
            AdminGroup.all()
        ]
        (Groups.TIHLDE, status.HTTP_403_FORBIDDEN),
        (Groups.JUBKOM, status.HTTP_403_FORBIDDEN)
    ]
)
def test_create_blog_as_member(
    member,
    group_name,
    excpected_status_code
):
    """
    A member of one of the admin groups should be able to
    create a blog. Other members should not be allowed.
    """
    add_user_to_group_with_name(member, group_name)
    client = get_api_client(user=member)
    data = get_blog_data()

    response = client.post(
        API_BLOGS_BASE_URL,
        data=data
    )
    assert response.status_code == excpected_status_code
```

Her setter vi opp en test som skal teste hvilke medlemmer som har lov til å opprette en blogg. Vi setter opp at alle medlemmer av en gruppe fra AdminGroup (HS og undergrupper) skal få status kode 200, men andre medlemmer som vanlige TIHLDE og JUBKOM medlemmer skal ikke få tilgang.
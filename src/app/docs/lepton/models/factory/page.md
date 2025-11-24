---
title: 'Opprettelse av falske modell instanser'
---

Når vi skal teste våre endpunkt og våre modeller, så må vi ofte ha noen instanser av en modell å teste opp i mot. Siden hver test lager en ny "falsk" database, så krever dette opprettelse av instanser for hver test.

Det tar lang tid å skulle bruke Django ORM til å opprette ny instanser hver gang. Derfor har vi noe vi kaller **Factory**. Dette vil si at man lager en fabrikk for en modell, og ved å kalle på denne får man en instans med enten tilfeldige verdier, eller faste verdier vi setter selv.

## Hvordan sette opp en Factory

For å sette opp en **Factory** bruker vi **factory-boy** og Django sitt eget.

```python
import factory
from factory.django import DjangoModelFactory

from app.common.enums import GroupType
from app.content.factories.user_factory import UserFactory
from app.group.models import Group


class GroupFactory(DjangoModelFactory):
    """Factory that creates a generic group"""

    class Meta:
        model = Group

    name = factory.Sequence(lambda n: f"Group{n}")
    slug = factory.Sequence(lambda n: f"Group{n}")
    description = factory.Faker("sentence", nb_words=100, variable_nb_words=True)
    contact_email = factory.LazyAttributeSequence(
        lambda o, n: f"{o.slug}@{n}.example.com"
    )
    type = GroupType.SUBGROUP
    fines_activated = True
    fines_admin = factory.SubFactory(UserFactory)
```

Her ser vi et eksempel på hvordan man kan lage en **Factory** for **Group** modellen. Vi arver **DjangoModelFactory**, som gir oss muligheten til å lage falske instanser av en modell.

I tillegg bruker vi factory-biblioteket for å kunne lage tilfeldige verdier. Her ser vi hvordan vi både oppretter tilfeldige verdier, men setter også noen til å være konstante.

Det anbefales å lage en **Factory** så utfyllende som mulig, slik at de blir lettere å bruke og kan brukes til flere ulike testscenarioer.

## Hvordan bruke en instans fra en Factory

```python
# Hent en instans
group = GroupFactory()

# Hent en instans med verdier vi setter selv
custom_group = GroupFactory(
    name="Min gruppe",
    slug="min-gruppe"
)
```

Her ser du at man enten kan opprette en instans av **Group** med både tilfeldige og konstante verdier slik vi konfigurerte klassen. Men vi kan også endre en eller flere verdier slik vi selv vil.

Du kan lese mer om ulike metoder man kan benytte med **factory-boy** [her](https://factoryboy.readthedocs.io/en/stable/).

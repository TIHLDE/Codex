---
title: "Hvordan håndtere hierarki og arv mellom modeller"
---

I noen tilfeller er det ønskelig å samle flere modeller under én moderklasse. Hensikten med dette er å kunne dele fellestrekk mellom ulike modeller, samtidig som vi kan skille på de ulike modellene med egne serializere og viewsets.

# Forms som eksempel

For å fremme frem nytten med dette konseptet, skal vi bruke et eksempel. I vårt system så gir vi brukere mulighet til å opprette spørreskjemaer. Men det finnes ulike spørreskjemaer. Grupper kan lage sine egne, og arrangementer kan også lage sine egne. Men her ser vi at det er mange fellestrekk. Dermed er det redundant å lage to modeller som repeterer de samme verdiene.

## Hva er polymorfisme?
Polymorfisme er evnen til en klasse til å referere til sine barn ved hjelp av et attributt. På denne måten kan man ut ifra å bruke en moderklasse for en modell, peke til riktig modell når man skal hente ut data.

## Moderklassen Form
Vi bruker biblioteket [django-polymorphic](https://django-polymorphic.readthedocs.io/en/stable/quickstart.html#making-your-models-polymorphic) for å kunne utføre slike egenskaper. Ved hjelp av dette biblioteket får vi muligheten til å opprette modeller og serializere som håndtere denne utpekelsen av riktig type spørreskjema.

```python
...
from polymorphic.models import PolymorphicModel
...


class Form(PolymorphicModel, ...):
    ...

    title = models.CharField(max_length=400)
    template = models.BooleanField(default=False)

    viewer_has_answered = None

    ...
```

Over ser du et eksempel på hvordan modellen **Form** arver **PolymorphicModel**. I tillegg har vi opprettet verdier som vi anser som relevante for alle barneklasser.

```python
class EventForm(Form):

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="forms"
    )
    type = models.CharField(
        max_length=40,
        choices=EventFormType.choices,
        default=EventFormType.SURVEY
    )


class GroupForm(Form):

    email_receiver_on_submit = models.EmailField(
        max_length=200,
        null=True,
        blank=True
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="forms"
    )
    can_submit_multiple = models.BooleanField(default=True)
    is_open_for_submissions = models.BooleanField(default=False)
    only_for_group_members = models.BooleanField(default=False)
```

Videre ser du hvordan man bruker moderklassen i de andre modellene. Man arver de på helt vanlig måte som du er vandt til med å gjøre med andre klasser. Som du ser, så er selve oppsettet av modellene veldig enkelt å sette opp grunnet bruken av biblioteket som gjør mye av logikken i bakgrunnen.

## Hjelpemetoder
Det kan nevnes fort til slutt at i moderklassen **Form** har vi opprettet et par **classmethod** for å sjekke hvilken klasse vi vil referere til.

```python
class Form(PolymorphicModel, ...):
    ...

    @classmethod
    def is_event_form(cls, request):
        return request.data.get("resource_type") == "EventForm"

    @classmethod
    def is_group_form(cls, request):
        return request.data.get("resource_type") == "GroupForm"

    ...
```

Merk at vi ønsker å opprette et ny nøkkel i vår POST / PUT request body som heter **resource_type**. Navnet på denne nøkkelen velger vi selv. Dette skal vi se på i neste seksjon om hvordan man løser dette i serializer klasse. Det kan du lese om [her.](/docs/lepton/serializers/polymorphic)




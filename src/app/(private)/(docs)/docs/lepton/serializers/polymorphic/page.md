---
title: "Hvordan sende riktig JSON data"
---

Dette er en videreføring på dokumentasjonen om polymorfisme i modeller som du kan lese om [her](/docs/lepton/models/polymorphic). Denne tar utgangspunkt i at du har lest og forstått oppsettet av modeller før du leser dette.

# Forms som eksempel
Vi fortsetter å bruke modellen **Form** og de respektive barneklassene for å vise hvordan polymorfisme fungerer i Django. Vi bruker biblioteket [django-rest-polymorphic](https://github.com/denisorehovsky/django-rest-polymorphic) for å kunne kombinere vår serializer med modellene våre.

## Oppsett av serializere
Første steg er å sette opp serializer klasser for alle tre klassene, slik vi er vandt til:
```python
class FormSerializer(...):
    ...
    class Meta:
        model: Form
        fields : (
            ...
        )

class GroupFormSerializer(...):
    ...
    class Meta:
        model: GroupForm
        fields : (
            ...
        )

class EventFormSerializer(...):
    ...
    class Meta:
        model: EventForm
        fields : (
            ...
        )
```

Neste steg er å opprette vår **mapper**. En mapper har som funksjon å dirigere data'en til riktig serializer slik at vi får tilbake en respons med de riktige verdiene.

```python
...

from rest_polymorphic.serializers import PolymorphicSerializer

...


class FormPolymorphicSerializer(
    PolymorphicSerializer,
    ...
):
    resource_type_field_name = "resource_type"

    model_serializer_mapping = {
        Form: FormSerializer,
        EventForm: EventFormSerializer,
        GroupForm: GroupFormSerializer,
    }

    class Meta:
        model = Form
        fields = "__all__"
```

Følgende steg er nødvendig for å sette opp slik at den vil mappe riktig i forhold til modellene og de andre serializerne:

1. Sette opp et resource_type nøkkelnavn. Her er den satt til "resource_type", men navnet er valgfritt.
2. Sette opp variabelen model_serializer_mapping. Dette tar et dictionary for å mappe hvilke modeller som skal sendes til hvilken serializer.
3. Sette opp en Meta model. Dette er viktig for at de andre klassene vi bruker skal fungere som forventet.
4. For å få med alle verdier for de respektive modellene, må man sette inn de verdiene man ønsker i de ulike serializerne.

## Oppsett av create og update serializer
Dessverre så støtter ikke polymorfisme bibliotekene våre en god måte å opprette create og update metoder for vår mapper serializer. Dermed må vi opprette egne create og update serializere for hver og en av våre serializere.

```python
class GroupFormCreateSerializer(...):
    ...
    class Meta:
        model: GroupForm
        fields : (
            ...
        )

    def create(self, validated_data):
        # Utfør logikk her
        return super().create(validated_data)


class GroupFormUpdateSerializer(...):
    ...
    class Meta:
        model: GroupForm
        fields : (
            ...
        )

    def update(self, instance, validated_data):
        # Utfør logikk her
        return super().update(instance, validated_data)
```

Som du ser her så gjør vi dette på samme måte som alltid, der vi spesifiserer hvilke fields vi ønsker å validere og hvordan vi skal oppdatere og lage instanser.

## Veien videre
Neste steg er å implementere modellen og serializern inn i vårt viewset slik at vi kan sette opp våre endepunkter. Det kan du lese om [her.](/docs/lepton/viewsets/polymorphic)
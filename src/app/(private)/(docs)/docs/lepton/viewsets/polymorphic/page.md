---
title: "Hvordan håndtere hierarki og arv mellom modeller"
---

Siste del av den tredelte guiden av polymorfisme handler om hvordan vi bruker vår [serializer](/docs/lepton/serializers/polymorphic) og [modell](/docs/lepton/models/polymorphic) til å sette opp selve endepunktet ved hjelp av et viewset.

# Eksempel med Form
Hvordan vi setter opp et endepunkt for polymorfisme er i bunn og grunn veldig likt som vanlig:

```python
class FormViewSet(...):
    serializer_class = FormPolymorphicSerializer
    queryset = Form.objects.all()
```

Her ser du at vi bruker vår **FormPolymorphicSerializer**, og setter vårt queryset til å bruke moderklassen **Form**. Dette vil gjøre at vi vil kunne hente ut en rekke med instanser, som da vil returnere alle typer spørreskjemaer, og da returnere hvert JSON objekt med de respektive data'ene.

## Create og Update
Den eneste forskjellen vi må gjøre omhandler create og update metodene. Dette kommer av at vi må selv dirigere endepunktet til å bruke riktig serializer.

```python
def create(self, request, *args, **kwargs):
    data = request.data
    resource_type = data.get("resource_type")

    if resource_type == "GroupForm":
        serializer = GroupFormCreateSerializer(data=data)
    elif resource_type == "EventForm":
        serializer = EventFormCreateSerializer(data=data)
    
    if serializer.is_valid():
        form = self.perform_create(serializer)
        return Response(
            FormPolymorphicSerializer(form).data,
            status=status.HTTP_201_CREATED
        )
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

def update(self, request, *args, **kwargs):
    instance = self.get_object()
    data = request.data
    resource_type = data.get("resource_type")

    if resource_type == "GroupForm":
        serializer = GroupFormUpdateSerializer(instance, data=data)
    elif resource_type == "EventForm":
        serializer = EventFormUpdateSerializer(instance, data=data)

    if serializer.is_valid():
        super().perform_update(serializer)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )
```

På denne måten router vi til riktig serializer slik at vi kan opprette og oppdatere instanser på riktig måte.

{% callout title="Må prøves!" %}
Per nå har jeg ikke fått testet ut ordentlig med routing til riktig serializer. Det kan hande det går an å bruke FormPolymorphicSerializer med create og update metoder, hvis man kaller på serializeren med parameteret partial=True

Dette må utforskes
{% /callout %}
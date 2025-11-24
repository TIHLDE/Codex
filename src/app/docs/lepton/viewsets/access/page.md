---
title: 'Tilgangskontroll'
---


Før du leser denne dokumentasjonen er det viktig at du først leser om hvordan vi setter opp hvem som skal ha hvilke rettigheter gjennom våre modeller. Dette kan du lese om under *Models* dokumentasjonen.

## Hvordan vet endepunktene hvilke rettigheter de skal se etter?

Frem til nå har vi satt opp to gruppelister som attributter og noen egne metoder, men det er ingenting som tilsier at disse skal ha noe effekt. For at det programmet skal vite at det skal se etter disse metodene så må vi legge til en klasse i viewsettet.

```python
class BasicViewPermission(DRYPermissions):
    def has_permission(self, request, view):
        set_user_id(request)
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj)

# I viewsettet
class ArticleViewSet(...):
    permission_classes = [BasicViewPermission]
```

Ved å sette **permission_classes** til **BasicViewPermission** så arver vi fra DRYPermissions som har kode som sjekker opp mot metodene vi definerte i modellen vår.

### Detaljert informasjon

Per i dag er mange av modellene våre skrevet dårlig når det kommer til rettigheter. De er mangelfulle og forvirrende, og mangler flere metoder. For å forstå hvorfor dette er et problem, så må vi se på hvordan vi henter rettighetene til en bruker i frontend.

```python
@action(detail=False, methods=["get"], url_path="me/permissions")
def get_user_permissions(self, request, *args, **kwargs):
    try:
        serializer = UserPermissionsSerializer(
            request.user, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception:
        return Response(
            {"detail": "Kunne ikke hente brukerens tillatelser"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
```

Som bruker følgende serializer:

```python
class UserPermissionsSerializer(serializers.ModelSerializer):
    permissions = DRYGlobalPermissionsField(
        actions=[
            "write",
            "write_all",
            "read",
            "read_all",
            "destroy",
            "update",
            "retrieve",
        ]
    )

    class Meta:
        model = User
        fields = ("permissions",)
```

{% callout title="Obs! Ekstra rettigheter?" %}
Her ser du at det er lagt til write_all og read_all. Det er fordi det er mulig å legge til egendefinerte rettigheter, og det brukes i noen få tilfeller i noen modeller. Mer dokumentasjon om dette vil komme senere.
{% /callout %}

Her ser vi at vi har et endepunkt vi kaller på i frontend for å sjekke hvilke rettigheter en bruker har og hva brukeren kan gjøre basert på de. Ut ifra vår serializer så bruker vi **DRYGlobalPermissionsField** som ser på våre globale rettigheter for å si ifra hvilke rettigheter bruker har for hver eneste modell vi bruker.

Per nå ser vi kun på write og write_all i frontend, men det kan hende at vi senere trenger mer spesifikke detaljer, og dermed er det viktig at alle våre modeller følger riktig konvensjon. Per i dag er det mange modeller som må refaktoreres.

Så det kan først virke som om det er unødvendig å skrive alle global rettighetene som kaller på samme metode, men for at frontend skal få mest mulig informasjon, så er det viktig at vi fyller ut alle metodene. Til slutt vil standardisering resultere i mer lesbar kode, som er lettere å sette seg inn i.
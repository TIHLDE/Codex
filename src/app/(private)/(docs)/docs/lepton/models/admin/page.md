---
title: 'Konfigurere modell for Django Admin Panel'
---

Hvis du skal kode mye i Lepton så kommer din TIHLDE bruker til å bli gjort om til en **Superuser**. Dette vil si at du får tilgang til Django sitt innebygde admin panel.

Panelet kan du finne på [https://api.tihlde.org/admin/](https://api.tihlde.org/admin/). Her logger du inn med din TIHLDE bruker.

Inne på dette panelet får du en liste med alle våre **registrerte modeller** og kan se alle instanser, og slette og oppdatere instanser. Du kan også søke og filtrere. Det er rett og slett et oppslagsverk for oss i Index som gjør at vi slipper å lage en egen frontend for mye av dette.

## Registrering av modell

For at en modell skal bli vist i panelet må modellen registreres i admin.py filen som er felles for alle modellene i appen den ligger i. I noen apper så ligger filen under en egen admin mappe.

```python
from django.contrib import admin
from app.myapp import models

admin.site.register(models.News)
```

Dette er den letteste måten å registrere modellen på. Ved å gjøre dette får man en paginert liste med 100 instanser per side, men ikke noe mer filtrering- eller søkeverktøy. Dette fører til at det er vanskelig å finne frem når man etterhvert får veldig mange rader for en tabell.

### Konfigurert registrering

Derfor ønsker vi å sette opp noen ekstra justeringer.

```python
@admin.register(models.Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "event",
        "is_on_wait",
        "has_attended"
    )

    search_fields = (
        "user__user_id",
        "event__title",
        "user__first_name",
        "user__last_name",
    )

    readonly_fields = (
        "created_at",
        "updated_at"
    )

    list_filter = (
        "is_on_wait",
        "has_attended",
        "event",
        "user",
    )
    # Enables checks bypassing from the 'Action' dropdown in Registration overview
    actions = [
        admin_delete_registration,
    ]
```

Her har vi hentet ut et eksempel fra kodebasen som viser hvordan vi setter opp **Registration** modellen i admin panelet. Dette er registreringer for arrangementer som blir opprettet når en bruker melder seg på.

- **list_display**: Detter er hvilke felter som skal vises i listen over de 100 viste instansene per side. Hvis man trykker på en enkelt instans får man all info.
- **search_fields**: En søkebar på toppen som lar deg søke etter disse attributtene. Dobbel understrek (\_\_) er for å markere at det er en relasjon til en annen modell.
- **readonly_fields**: Dette er felter som kun kan leses og ikke oppdateres.
- **list_filter**: På høyre side av listen med instanser kommer det opp en liste med filtreringsalternativer. I dette tilfellet kan for eksempel filtrere etter brukere og om de er på venteliste.
- **actions**: Som default er det kun en action: å slette instansen. Men i noen tilfeller, som dette, ønsker vi å gjøre andre ting eller mer med data. Dermed kan vi legge til våre egne metode. Dette eksempelet er en metode som sletter litt diverse og oppdaterer ventelisten.

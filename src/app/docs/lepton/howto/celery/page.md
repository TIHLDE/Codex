---
title: 'Hvordan bruke Celery og tasks'
---

Celery er et bibliotek som gir oss muligheten til å sette opp det vi kaller **tasks**. En task er en metode som blir utført til et gitt tidspunkt. Dette kan enten bli satt opp med en **cronjob** eller at vi selv setter et tidspunkt i fremtiden den skal kjøre.

## Oppsett av en task

```python
class BaseTask(celery.Task):
    """
    This base task supplies the logger to the underlying worker on init.
    The logger may then be used like this: `self.logger.info("Hi")`
    """

    def __init__(self):
        import logging

        self.logger = logging.getLogger(__name__)
```

Vi har laget en egen klasse som vi bruker for alle tasks. Den gjør ikke stort annet enn å arve fra Celery sin **Task** klasse og legge til muligheten for logging.

I hver **app** finner man en mappe som heter **tasks**. Inni her oppretter man tasks.

### Cronjob

En **cronjob** er en jobb vi setter til å bli gjort til et spesifikt tidspunkt. Dette kan være hvert 15. minutt 24/7 eller kun klokken 12 hver dag.

```python
from app.celery import app
from app.util.tasks import BaseTask


@app.task(bind=True, base=BaseTask)
def delete_old_log_entries(self, *args, **kwargs):
    from datetime import timedelta

    from django.contrib.admin.models import LogEntry

    from app.util.utils import now

    LogEntry.objects.filter(action_time__lte=now() - timedelta(days=30)).delete()
    self.logger.info("Log entries older than 30 days have been deleted")
```

Dette er en task som vi bruker for å slette alle logger om bruk av nettsiden som er eldre enn 30 dager. Dette er for å spare plass i databasen.

Det første man gjør for å lage en task er å bruke celery sin dekoratør. Vi henter ut app fra vår config fil til celery.

- **bind**: Dette settes alltid til True, og gjøres for at tasken kan kalle på seg selv ved hjelp av **self** argumentet. Dette er for at en task skal kunne prøve på nytt hvis den feiler. Alle tasks må derfor ha self som første argument selv om self ikke brukes.
- **base**: Hvilken klasse vi skal bruke, og da bruker vi vår klasse nevnt tidligere.

Dette er en task som vi skal bruke i en cronjob. For å finne frem til våre cronjobs så må vi inn i config filen til celery i app/celery.

```python
schedule = {
    ...,
    "delete_log_entries": {
        "task": "app.common.tasks.delete_old_log_entries",
        # 12:00 every day
        "schedule": crontab(hour="12", minute="0"),
    },
}

app.conf.update(
    beat_schedule=schedule,
    ...
)
```

Her ser vi at vi har sett opp et **schedule** som lister opp alle cronjobs vi skal benytte oss av med tilhørende metode og kjøreplan. Denne setter vi inn i konfigurasjonen til vår **celery app**.

### Fremtidige tasks

I noen tilfeller så ønsker vi å kjøre en task et x antall sekunder, minutter eller timer frem i tid.

```python
@app.task(bind=True, base=BaseTask)
def check_if_has_paid(self, event_id, registration_id):
    registration = Registration.objects.filter(registration_id=registration_id).first()
    event = Event.objects.filter(id=event_id).first()

    if not registration or not event:
        return

    user_orders = Order.objects.filter(event=event, user=registration.user)

    if not user_orders:
        registration.delete()
        return

    if not has_paid_order(user_orders):
        registration.delete()
```

Dette er en task som sjekker om en bruker har betalt for et arrangement når betalingstiden har gått ut. Tasken settes opp helt likt som alle andre tasks.

{% callout title="Konfig for asynkrone tasks" %}
For å kjøre en asynkron task så er det en innstilling i celery som må være satt til False for at dette skal gå.

```python
app.conf.update(
    beat_schedule=schedule,
    ...,
    task_always_eager=False
)
```

Hvis task_always_eager ikke er satt til False vil tasken kjøre med en gang man kaller på den istedenfor til angitt tid i fremtiden.
{% /callout %}

Forskjellen er hvordan vi aktiverer denne tasken.

```python
check_if_has_paid.apply_async(
    args=(event.id, registration.registration_id),
    countdown=get_countdown_time(event, from_wait_list),
)
```

Ved å bruke metoden **apply_async** kaller vi på tasken, men gir beskjed om hvor lenge til det det er den skal bli utført.

- **args**: Alle argumenter man kan sende inn i tasken må sendes som en tuppel i args argumentet.
- **countdown**: Når tasken skal kjøre. Definert i sekunder. **get_countdown_time** returnere et x antall sekunder som tasken skal vente før den kjører.

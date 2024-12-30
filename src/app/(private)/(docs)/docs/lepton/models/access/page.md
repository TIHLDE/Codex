---
title: 'Tilgangskontroll'
---

Når man konstruerer et API, er tilgangskontroll noe som vil dukke opp etterhvert. Hvem skal få tilgang til hva? Skal alle få lov til å opprette arrangementer?

I Lepton bruker vi et bibliotek som heter **django-dry-rest-permissions**. Dette gir oss muligheten til å definere et sett med rettigheter på modell nivå, og så vil vårt viewset automatisk returnere en **403 forbidden** respons hvis en som ikke har riktige rettigheter prøver å kalle på endepunktet.

Denne dokumentasjonen vil være basert på [original dokumentasjon](https://github.com/dbkaplan/dry-rest-permissions). Men den kan være litt kronglete å forstå og man må holde tunga rett i munnen for at dette skal fungere riktig.

## Hvilket system bruker vi?

Først skal vi se litt på ulike aksesskontroll systemer. Det vanligste systemet er rollebasert aksesskontroll. Dette vil si at en bruker kan ha en eller flere roller, som gir brukeren et sett med rettigheter.

Det vi bruker er gruppebasert aksesskontroll. Dette gjør at din tilhørighet til en spesifikk gruppe bestemmer hva du kan gjøre. Dette fungerer greit nok for det meste, men fjerner muligheten til spesialtilpassete rettigheter for enkeltbrukere. Det har vært scenariorer der en bruker trenger å gjøre noe, og enste muligheten for at det skal gå er plasse personen i HS sin gruppe, som du sikkert forstår ikke er optimalt.

Rettighetsystemet ble laget før min tid, og jeg anser det som tech debt i dag. Per i dag er det ikke et stort nok problem til at det er verdt å endre på. Et optimalt system ville vært en kombinasjon av det vi har i dag og at et enkeltbrukere kunne fått tildelt spesifikke rettigheter.

## Hvordan definere rettigheter

Det første vi må gjøre for å kunne definere rettigheter for et endepunkt er å finne tilhørende modell. I dette eksempelet skal vi følge muligheten for å opprette en artikkel, som vi vil si at alle brukere skal ha lov til.

### Arv og default rettigheter

Alle våre modeller arver fra følgende klasse:

```python
class BasePermissionModel(models.Model):
    read_access = []
    write_access = []

    class Meta:
        abstract = True

    ...
```

Det første som skjer i klassen, er at det settes en default verdi for rettigheten til å lese (GET forespørsler) og å skrive (POST, PUT og DELETE forespørsler).

De to listene inneholder **Grupper** som en bruker kan tilhøre. Dette er det vi anser som default rettigheter for endepunktene. Hvis listene er tomme, trenger man ikke å være logget inn som et TIHLDE medlem for å kalle på endepunktene.

### Rettigheter på globalt- og objektnivå

Når vi skal sette opp rettigheter for en modell så forholder **django-dry-rest-permissions** seg til to ulike nivåer; globalt og objekt. En global rettighet sjekker rettighetene til brukeren på et overordnet nivå. Mens objektnivå sjekker rettighetene til en bruker for et spesifikt objekt. Altså en rad i en tabell.

Når et endepunkt blir kalt på så sjekker koden rettighetene i følgende trinn:

1. Sjekker globale rettigheter. Hvis dette returnerer False, så får brukeren en 403 respons tilbake.
2. Hvis derimot den globale rettigheten blir returnerer True, blir rettigheten på objekt nivå sjekket.

### Hvordan sjekke globalt og objekt nivå

```python
class BasePermissionModel(models.Model):
    ...

    @classmethod
    def has_read_permission(cls, request):
        if not len(cls.read_access):
            return True
        return check_has_access(cls.read_access, request)

    @classmethod
    def has_write_permission(cls, request):
        if not len(cls.write_access):
            return True
        return check_has_access(cls.write_access, request)

    def has_object_write_permission(self, request):
        return self.has_write_permission(request)

    def has_object_read_permission(self, request):
        return self.has_read_permission(request)
```

Her har vi vår default sjekk av globale og objektnivå rettigheter. Det som skiller de to er at globale rettigheter må være en **@classmethod** og dermed kan ikke instansen av modellen kalle på seg selv og sine verdier. En objektnivå rettighet har object i navnet.

Navnekonvensjonen her er viktig at er rett, eller så vil ikke programmet klare å lese at dette skal behandle rettighetene.

```python
# Global
def has_<type>_permission(cls, request):
    ...

# Objekt
def has_object_<type>_permission(self, request):
    ...
```

Det defaulten til klassen er satt til er at **read** og **write** settes til å sjekke først globalt nivå, der vi benytter en selvkodet metode **check_has_access(permission_groups, request)** for å sjekke om brukeren tilhører en av de tillatte gruppene. Metodene på objektnivå følger de globale metodene.

### Tilpasning av rettigheter

Nå skal vi se videre på eksempelet vårt for artikler og hvordan man kan tilpasse ulike rettigheter.

Per nå har vi sett på hvordan man kan definere **read** (GET) og **write** (POST, PUT, DELETE) rettigheter. Men hva hvis vi ønsker mer spesifikke rettigheter. Kanskje du vil at de oppgitte gruppene skal kunne lage, oppdatere og slette en artikkel, men at ikke andre brukere skal kunne redigere dine egne artikler, eller at visse grupper skal få lov til det.

Det er mulig å spesifisere disse metodene enda mer for å treffe de ulike endepunktene:

- **write**: Vi bruker write som default for oppretting (POST).
- **update**: Vi bruker update for å oppdatere (PUT).
- **destroy**: Vi bruker destroy for å slette (DELETE).
- **read**: Dette gjelder for både retrieve og list.
- **list**: Dette gjelder kun for å hente flere. (Funker ikke på objektnivå)
- **retrieve**: Dette gjelder kun for å hente kun en.

Denne listen kjører også i en bestemt rekkefølge. Vi kan nå slå den sammen med rekkefølgen til globale og objektnivå rettigheter også:

1. **Global write**: Denne sjekker POST, PUT, DELETE.
2. **Global update**: Denne overkjører write for PUT. Dermed er det denne som gjelder. Men kun hvis Global Write først returnerer True.
3. **Global destroy**. Denne overkjører write for DELETE. Dermed er det denne som gjelder. Men kun hvis Global Write først returnerer True.
4. **Objektnivå write**: Denne sjekker PUT og DELETE på objektnivå. Siden POST ikke har noe objekt enda, så funker den ikke for POST.
5. **Objektnivå update**: Denne sjekker PUT for et spesifikt objekt. Dermed er det denne som gjelder. Men kun hvis Objetktnivå write returnerer True.
6. **Objektnivå destroy**: Denne sjekker DELETE for et spesifikt objekt. Dermed er det denne som gjelder. Men kun hvis Objetktnivå write returnerer True.
7. Så fortsette samme for **read**, men i likhet med POST så finnes ikke det et objektnivå for GET list, siden en liste med objekter er ikke ett spesifikt objekt, og dermed ikke på objektnivå.

Dette er mye å ta høyde for, og er lett å bli forvirret. Man er avhengig av å lage en del modeller med ulike kompleksitet på rettighetene for å få ordentlig kontroll på det.

### Oppsett av rettigheter for en artikkel

La oss nå ta for oss et eksempel med artikkelen. Vi starter med å se på default rettigheter:

```python
from app.utils.models import BaseModel
from app.common.permissions import BasePermissionModel


class Article(BaseModel, BasePermissionModel):
    read_access = (Groups.TIHLDE, )
    write_access = (Groups.TIHLDE, )

    ...
```

Som default ønsker vi at alle som er medlem av TIHLDE skal få lov til å opprette en artikkel og lese sine egne og andre sine artikler. Men hvis vi lar det stå som dette betyr det at hvem som helst kan redigere og slette dine artikler. Dermed må vi justere rettighetene. Vi starter med å se på globale rettigheter.

```python
from app.utils.models import BaseModel
from app.common.permissions import BasePermissionModel


class Article(BaseModel, BasePermissionModel):
    ...

    @classmethod
    def has_update_permission(cls, request):
        return cls.has_write_permission(request)

    @classmethod
    def has_destroy_permission(cls, request):
        return cls.has_write_permission(request)

    @classmethod
    def has_list_permission(cls, request):
        return cls.has_read_permission(request)

    @classmethod
    def has_retrieve_permission(cls, request):
        return cls.has_read_permission(request)
```

Her ser du at vi egt ikke har innført noe ny logikk. Siden vi arver **has_write_permission** og **has_read_permission** fra **BasePermissionModel**, så trenger vi ikke å definere disse. Videre så har vi først nå bare sett på rettighetene på et globalt nivå. Vi vil jo at en bruker generelt skal ha lov til å opprette, oppdatere, slette og lese en artikkel. Derfor kaller vi bare på de arvete metodene slik at alt foreløpig er likt.

Men det er på objektnivå at forskjellen skjer. Og slikt er det i de fleste tilfeller. At det er først når vi snakker om spesifikke objekter at vi ønsker å begrense hvem som skal gjøre hva.

```python
from app.utils.models import BaseModel
from app.common.permissions import (
    BasePermissionModel,
    is_admin_user,
    is_promo_user
)


class Article(BaseModel, BasePermissionModel):
    ...

    def has_object_retrieve_permission(self, request):
        return self.has_read_permission(request)

    def has_object_update_permission(self, request):
        """
        Allow only the author of the article or
        a member of HS, Index or Promo edit.
        """
        return (
            request.user == self.author or
            is_admin_user(request) or
            is_promo_user(request)
        )

    def has_object_destroy_permission(self, request):
        """
        Allow only the author of the article or
        a member of HS, Index or Promo destroy.
        """
        return (
            request.user == self.author or
            is_admin_user(request) or
            is_promo_user(request)
        )
```

Her er det kun 3 objektnivå metoder vi kan benytte. Som nevnt tidligere kommer dette av at list (GET) og POST ikke omhandler et spesifikt objekt.

Når det kommer til uthenting av en enkelt artikkel, så ønsket vi at alle medlemmer skulle få lese hverandre sine artikler.

Når det kommer til oppdatering og sletting av en artikkel så ønsker vi kun å la brukeren som har skrevet artikkelen gjøre dette. Men i tillegg ønsker vi også at ved hjelp av selvkodede metoder (som i bunn og grunn bare kaller på check_has_access() fra tidligere med en liste over tilsvarende grupper) å la HS, Index og Promo redigere og slette for kontroll.

Hvis man legger inn mer kompleks logikk kan det være gunstig å legge til en kommentar om hva logikken prøver å sette som rettigheter for å gjøre det lettere for andre å forstå.

### Hjelpemetoder for rettigheter

I eksemplene over har vi benyttet oss av noen funskjoner som for eksemppl **is_admin_user**. I app.common.permissions har vi laget en del hjelpemetoder for å sjekke om en bruker tilhører en spesifikk gruppe. Dette er for å gjøre det lettere å lese koden og for å unngå å skrive samme kode flere ganger.

#### check_has_access

```python
def check_has_access(groups_with_access, request):
    set_user_id(request) # User middleware
    user = request.user

    if not user:
        return False

    try:
        groups = map(str, groups_with_access)
        return (
            user
            and user.memberships.filter(
                group__slug__iregex=r"(" + "|".join(groups) + ")"
            ).exists()
        )
    except Exception as e:
        capture_exception(e)
    return False
```

Denne metoden sjekker om en bruker tilhører en av de gruppene som er oppgitt i listen. Hvis brukeren tilhører en av gruppene vil metoden returnere True, ellers False. Denne metoden brukes i de fleste tilfeller for å sjekke om en bruker har tilgang til en ressurs.


#### check_has_full_access

```python
def check_has_full_access(groups_with_access: list[str], request):
    """Check if user has access to all groups"""
    set_user_id(request) # USer middleware
    user = request.user

    if not user:
        return False

    try:
        groups = map(str, groups_with_access)
        return user and user.memberships.filter(
            group__slug__iregex=r"(" + "|".join(groups) + ")"
        ).count() == len(groups_with_access)
    except Exception as e:
        capture_exception(e)
    return False
```

Denne metoden sjekker om en bruker tilhører alle gruppene som er oppgitt i listen. Hvis brukeren tilhører alle gruppene vil metoden returnere True, ellers False. Denne metoden brukes i de tilfeller der en bruker må tilhøre alle gruppene for å få tilgang til en ressurs.


#### set_user_id

```python
def set_user_id(request):
    # If the id and user of the request is already set, return
    if (hasattr(request, "id") and request.id) and (
        hasattr(request, "user") and request.user
    ):
        return

    token = request.META.get("HTTP_X_CSRF_TOKEN")
    request.id = None
    request.user = None

    if token is None:
        return None

    try:
        user = Token.objects.get(key=token).user
    except Token.DoesNotExist:
        return

    request.id = user.user_id
    request.user = user
```


Denne metoden er det vi kaller et middleware. Denne metoden blir kalt før hver forespørsel som kommer inn til serveren. Denne metoden setter id og bruker på forespørselen. Dette gjør at vi kan hente ut brukeren i de ulike metodene som sjekker rettigheter. Denne metoden er nødvendig for at de andre metodene skal fungere.

Denne metoden henter ut en unik token, som er en del av forespørselen som blir sendt av brukeren. Denne tokenen blir brukt til å hente ut brukeren som har sendt forespørselen. Hvis brukeren ikke har sendt med en token, eller tokenen ikke er gyldig, vil metoden returnere None.

Koden her er litt misvisende, da det ser ut som om nøkkelen til token er **HTTP_X_CSRF_TOKEN**, men den er i virkeligheten **x-csrf-token**. Dette er en oversettelse av Django, og det er derfor viktig å vite at det er **x-csrf-token** som er nøkkelen til token, når man sender en forespørsel fra frontend.

## Hvordan vet endepunktene at de skal se etter disse rettighetene?

Frem til nå har vi satt opp to gruppelister som attributter og noen egne metoder, men det er ingenting som tilsier at disse skal ha noe effekt. For at det programmet skal vite at det skal se etter disse metodene så må vi legge til en klasse i viewsettet. Dette kan du lese mer om under viewset dokumentasjonen.
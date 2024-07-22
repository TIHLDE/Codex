---
title: Pytest
---

For å teste koden vår bruker vi et kjent og mye brukt test-bibliotek som heter **Pytest**. Dette er et bibliotek som lar oss teste både enhetstester og integrasjonsstester på en god måte.

## Hvordan strukturere kodebasen for testing
Pytest følger et sett med instruksjoner, som alle programmer, for å finne frem til hvor det er tester som skal kjøres. I Lepton så har vi lagt til en egen **tests** mappe på root nivå. Det vil si at når du åpner mappen **app** så vil du finne en mappe som heter **tests**.

Her inne finner du integrasjonstestene våre. Filoppsettet her er likt som for våre *apper*. Det vil si at hvis vi har en *app* som heter *content* (som inneholder models, views og serializers) så vil det være en tilsvarende *content* mappe under **tests** mappen.

Her navngir vi filene slik:

```python
test_<model_name>_integration.py

# Eksempel
test_event_integration.py
```

Når det kommer til enhetstester derimot så har vi også egene **tests** mapper innad i våre *apper*. Her følger vi samme opplegg, men med litt annen navnsetting:

```python
test_<model_name/functionality>_<type>

# Eksempel
test_event_model.py
test_event_utils.py
test_date_utils.py
```

En ennhetsstest kan som i første eksempel teste metoder som befinner seg på en modell, eller så kan det teste andre funksjonaliteter som vist i de to neste eksemplene.

Fellestrekket er at alle testfiler starter med *test*.

## Hvordan sette opp en test med Pytest
```python
import pytest

@pytest.mark.django_db
def test_expired_when_event_has_not_expired(event):
    """Should return False when end date is before yesterday."""
    event.end_date = now()
    event.save()

    assert not event.expired
```

Her ser du at vi markerer funksjonen med en dekoratør. Dette sier til pytest at vi skal lage en test som skal berøre databasen vår og dermed settes det opp en *fake* database som retter seg mot Django oppsettet vårt.

Navngivning av en test fungerer ved at man starter med *test* og deretter beskriver hva testen skal gjøre. I tillegg legger vi ved en kommentar som beskriver enda mer.

Til slutt bruker vi Python sitt nøkkelord **assert** for å sjekke ut om det vi tester True eller False. Alle tester må ende opp med True for å regnes som godkjent. Så hvis resultatet ditt skal ende opp med False, slik som i dette eksempelet må man bruke not før for å få testen til å bli godkjent.

Uansett om testen vår skal bruke data fra en database eller ikke så bruker vi den samme dekoratøren for alle tester, uansett om det er en enhetsstest, som her, eller en integrasjonsstest.

## Fixture
I forrige eksempel så du at vi hadde lagt til et **event** som parameter, og så på et magisk vis kunne vi bruke den som en instans av modellen vår *Event*. Hvordan går det?

```python
@pytest.fixture()
def event():
    return EventFactory()
```

Vi har en annen dekoratør fra pytest som bruker metoden fixture(). Dette er en metode som sier at vi kan lage parametere som vi kan putte inn i hvilken som helst test og som da gir oss en instans av *Event* laget med en **Factory**.

Hvis man går til hovedmappen **tests** som ligger på root nivå i *app*, så finner man en fil som heter **conftest.py**. Her kan man legge inn en hvilken som helst fixture og så vil den være brukbar i enhver test du bruker i kodebasen så lenge du har benyttet deg av @pytest.mark.django_db.

## Parametrisering
Ganske ofte så vil du teste en funksjon eller et endepunkt opp mot flere parametere. Dette kan for eksempel være at du vil teste hvordan et endepunkt reagerer på medlemmer av ulike grupper og deres rettigheter. Du har kanskje et endepunkt som er åpent for Index, men ikke for Sosialen. Den tugnvinte metoden er å skrive to tester, som er helt like, men som tester mot to ulike utfall.

```python
@pytest.mark.django_db
@pytest.mark.parametrize(
    "users_not_on_wait, users_on_wait, expected_list_count",
    [
        (0, 0, 0),
        (5, 0, 5),
        (1, 4, 1),
    ],
)
def test_list_count(event, users_not_on_wait, users_on_wait, expected_list_count):
    """Should return the number of registered users who are to attend."""
    event.limit = users_not_on_wait
    RegistrationFactory.create_batch(users_on_wait, is_on_wait=True, event=event)
    RegistrationFactory.create_batch(users_not_on_wait, is_on_wait=False, event=event)

    assert event.list_count == expected_list_count
```

Det er en egen dekoratør for dette. Ved å bruke **parametrize** metoden kan man legge til hvilke parametere man ønsker, og deretter hvilke verdier de skal ha. Disse kan settes inn som parametere i selve testfunksjonen. Merk at disse er spesifikke for testen og ikke kan kalles på i andre tester.

Dette fører til at Pytest kjører testen for x antall variasjoner du tester ut, så slipper du å skrive x antall tester om igjen.

Nå har du lært hvordan du setter opp tester med Pytest. I de to neste seksjonene skal vi se på hvordan vi setter opp **enhetstester** og **integrasjonstester**.


## Hvordan kjøre en test
I seksjonen om vår **Makefile** så viser vi til kommandoen *make test*. Dette er en kommando som vil kjøre gjennom alle våre tester i kodebasen.

Men siden dette er en stor kodebase så er det mange tester, som fører til at det tar lang tid å kjøre gjennom alle testene. Og mens du holder på å utvikle så må du som oftest kjøre gjennom dine nye tester ganske ofte.

Dermed kan vi legge til flagget **-k** for å velge ut en spesifikk fil og kjøre alle tester i den filen, eller en spesifikk test. Merk her at hvis det finnes flere tester med samme navn så kjøres alle. Det er derfor viktig at alle navn er spesifikke for hver test.

```make
make test args="-k app/tests/content/test_event_integration/test_list_as_anonymous_user -s"
```

Nå kjører vi kun *test_list_as_anonymous_user* testen og slipper alle andre tester. Merk at jeg også har lagt ved et **-s** flagg. Dette flagget gjør at eventuelle print() du har lagt ved i koden for å teste, vises i terminalen uansett om testen feiler eller blir godkjent.
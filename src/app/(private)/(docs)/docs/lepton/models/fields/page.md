---
title: 'Ulike typer attributter'
---

I intro seksjonen til modeller har vi sett på hovedtrekkene til en modell og hvordan dette representerer en tabell i vår database. Nå skal vi gå mer inn på de ulike typene attributter vi kan benytte oss av for å sette opp ulike verdier og relasjoner med andre modeller.

## Verdifelter

Når vi snakker om verdifelter, snakker vi om ulike typer som tall, strenger, tid og boolsk.

```python
class MyModel(BaseModel):
    ...

    title = models.CharField(max_length=200)
    description = models.TextField(default="", blank=True)
    start_date = models.DateTimeField()
    limit = models.IntegerField(default=0)
    closed = models.BooleanField(default=False)

    ...
```

Her har vi satt opp noen tilfeldige attributter som er verdier en rad i en tabell inneholder:

- **CharField**: En vanlig streng, men som i best practice skal bli satt til en makslengde ved hjelp av _max_length_. Merk at hvis man setter argumentet **unique** til **True**, så er makslengden 255 bokstaver.
- **TextField**: En vanlig streng, men av typen text, som vil si at den kan inneholde lange tekster. Brukes for nyhetsinnhold for eksempel.
- **DateTimeField**: Dette setter et **DateTime** objekt som representerer en dato og et tidspunkt.
- **IntegerField**: Et heltall.
- **BooleanField**: Sant eller usant. Må settes en **default**.

{% callout title="Hvor ble det av Id?" %}
Som du kanskjer har lagt merke til så er ikke en id som da fungerer som en primærnøkkel satt opp. Dette kommer av at Django automatisk setter opp en id attributt som er av typen heltall (eng. integer). Dette kan overkjøres ved å bruke PrimaryKey typen for et felt.
{% /callout %}

## Relasjoner

I de fleste tilfeller så har modellen din behov for en relasjon til en annen modell, om det er til en bruker eller noe annet. Derfor er det viktig å forstå forskjellen på ulike relasjoner.

### ForeignKey

En fremmednøkkel (eng. ForeignKey) er en nøkkel som betyr at din modell kan ha en relasjon til en annen modell, men kun en. Den andre enden kan derimot ha en relasjon til flere instanser av din modell.

```python
contact_person = models.ForeignKey(
    User,
    blank=True,
    null=True,
    default=None,
    on_delete=models.SET_NULL,
    related_name="contact_events",
)
```

Her ser vi hvordan vår modell skal kunne ha en kontaktperson. Vi ønsker kun å ha en kontaktperson per instans / rad i tabellen. En instans fra _User_ modellen derimot kan være kontaktperson til flere instanser av vår modell.

Merk også at vi har satt **on_delete** til **SET_NULL**. Dette betyr at hvis vår kontaktperson slettes, så blir verdien satt til **null**, som vi har åpnet for at er mulig ved hjelp av blank, null og default satt til None. **Related_name** er hvilket attributt vi kan benytte for andre enden av relasjonen:

```python
events_i_am_contact_user_for = my_user.contact_events
```

På denne måten kan vi enkelt hente ut alle instanser en bruker har en kobling mot.

{% callout title="Faren med CASCADE" %}
Argumentet on_delete har flere mulige verdier. En annen verdi er den kjente CASCADE, som betyr at hvis kontaktpersonen blir slettet, så blir også vår instans slettet.

Dette er risikabelt, spesielt hvis CASCADE går over flere relasjoner, da kan man risikere at mye data blir slettet med en feil. Derfor anmoder vi mot å bruke det i Index (Det finnes unntak så klart). I tillegg så lar SET_NULL oss bevare historisk data selv om relasjoner blir slettet.
{% /callout %}

### ManyToMany

En annen vanlig relasjon er at begge sider av relasjonen kan ha kobling mot flere instanser. Dermed trenger man en koblingstabell som lister opp hvilke instanser som kobler mot hverandre. Dette kan ofte føre til kluss, men Django løser alt dette for oss i bakgrunnen.

```python
favorite_users = models.ManyToManyField(
    User, related_name="favorite_events", blank=True
)
```

Ved å bruke **ManyToManyField** så kan vi enkelt sette opp en relasjon uten å lage en ekstra tabell selv. Dette gjør Django i bakgrunnen. ORM seksjonen viser også hvor enkelt det er å benytte seg av denne relasjonen i kode.

### OneToOne

I noen tilfeller ønsker man en **ForeignKey**, men man ønsker at begge sider kun skal kunne være koblet til en instans hver i motsetning til ForeignKey som åpner for at den ene siden kan ha flere tilkoblinger.

```python
group = models.OneToOneField(
    Group,
    blank=True,
    null=True,
    default=None,
    on_delete=models.SET_NULL
)
```

Dette eksempelet er hentet fra seksjonen som tar for seg set eksempel på hvordan man setter opp et endepunkt. Dette er snakk om en blogg som skal bli opprettet av en gruppe i TIHLDE, men hver gruppe kan kun ha en blogg. Dermed bruker man **OneToOneField**. Dette vil gjøre at Django tar høyde for eksisterende relasjoner når man prøver å opprette en ny relasjon, og nekte opprettelse hvis det allerede finnes en kobling.

## Bakvendte relasjoner

Hvis du har noe erfaring med ORM og backend rammeverk fra før, så vet du at slik Django setter opp sine tabeller og relasjoner ikke er normalt.

Det Django åpner for er at man kan sette relasjonen på begge sider av relasjonen uansett hvilken relasjon det er. Og dermed kan man sette argumentet **related_name** for å bestemme hva attributtet skal hete for den andre siden av relasjonen.

Dette kan være litt forvirrende i starten, hvertfall hvis du finner eksempler i kodebasen vår som setter de på en side av relasjonen vilkårlig. Men dette er egt bare behaglig for oss som utviklere og gjør det enda lettere å konfigurere tabeller i en database ved hjelp av kode.

**Merk at relasjonen må settes opp kun på en av modellene.**

Grunnen til at dette går handler om hvordan Django leser filene og migrasjonsfiler, og hvordan den setter lesing av en fil på vent, hvis en annen burde komme før for å sette opp relasjonene riktig. Du kan [lese mer om det her](https://docs.djangoproject.com/en/5.0/topics/db/queries/#how-are-the-backward-relationships-possible).

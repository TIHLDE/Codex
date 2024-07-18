---
title: 'Et lite eksempel'
---

I denne seksjonen vil vi gå gjennom et lite eksempel på hvordan man setter opp en tabell i vår database ved hjelp av en modell, og hvordan vi setter opp endepunkter ved hjelp av viewsets og serializere. Vi vil ikke gå i dybden på alle områdene mtp at alt dette er mer grundig dokumentert i videre seksjoner.

I dette eksempelet vil vi ta for oss opprettningen av en Blogg som kan ha artikler skrevet av en eller flere forfattere.

## Oppsett av tabeller
Siden Django er objektbasert så trenger vi å representere vår tabell i databasen som en klasse. Altså en modell. I dette tilfellet trenger vi tre modeller; Blog, Entry og Author. For Author bruker vi vår eksisterende User modell, siden det vil være medlemmer av TIHLDE som skal være forfattere.

### Arv
```python
class Blog(BaseModel, BasePermissionModel):
    ...

class Entry(BaseModel, BasePermissionModel, OptionalImage):
    ...
```

Vi starter med å arve **BaseModel** og **BasePermissionModel** for begge klasser siden vi ønsker både funksjonaliteten til Django sin innebygde Model klasse, og vi ønsker å styre hvem som skal ha ulike rettigheter for å kunne opprette, redigere, lese og slette.

*Entry* modellen arver i tillegg fra OptionalImage klassen siden vi ønsker å kunne legge ved et forsidebilde for hver artikkel.

### Default rettigheter
Når man benytter seg av BasePermissionModel klassen må man sette to default rettigheter for hvem som har lov til å redigere data og hvem som har lov til å lese data.

```python
class Blog(BaseModel, BasePermissionModel):
    write_access = (AdminGroup.HS, )
    read_access = (Groups.TIHLDE, )

class Entry(BaseModel, BasePermissionModel, OptionalImage):
    write_access = (AdminGroup.HS, )
    read_access = (Groups.TIHLDE, )
```

Som default bestemmer vi oss for at alle brukere som er medlem av TIHLDE (altså har en registrert og godkjent bruker) kan se blogger og lese innlegg i bloggen. Videre bestemmer vi oss for at kun brukere som er med i HS har lov til å opprette, oppdatere og slette blogger og innlegg.

### Attributter
Så må vi legge til attributter for begge klasser, altså verdier som skal være med for hver rad i tabellen.

```python
class Blog(BaseModel, BasePermissionModel):
    # Hvem har rettighet til å redigere som default
    write_access = (AdminGroup.HS, )
    # Hvem har rettighet til å se som default
    read_access = (Groups.TIHLDE, )

    # Tittel må være en streng på max 200 bokstaver
    title = models.CharField(max_length=200)
    # Beskrivelse må være en streng på max 200 bokstaver
    description = models.TextField(max_length=500)
    # Hver gruppe kan kun ha en blogg
    group = models.OneToOneField(
        Group,
        blank=True,
        null=True,
        default=None,
        on_delete=models.SET_NULL
    ) 

    # Feltene under blir automatisk lagt til fra forelderklassene, og trenger ikke å være med
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

class Entry(BaseModel, BasePermissionModel, OptionalImage):
    # Hvem har rettighet til å redigere som default
    write_access = (AdminGroup.HS, )
    # Hvem har rettighet til å se som default
    read_access = (Groups.TIHLDE, )

    # Tittel må være en streng på max 200 bokstaver
    title = models.CharField(max_length=200)
    # Ingress må være en streng på max 200 bokstaver
    ingress = models.TextField(max_length=500)
    # Teksten må være en tekst
    body = models.TextField()
    # Et innlegg kan ha kun ha en forfatter,
    # men en forfatter kan ha flere innlegg
    author = models.ForeignField(
        User,
        blank=True,
        null=True,
        default=None,
        on_delete=models.SET_NULL,
        related_name="blog_entries"
    )
    # Et innlegg må tilhøre en blogg
    blog = models.ForeignField(
        Blog,
        on_delete=models.CASCADE,
        related_name="entries"
    )

    # Feltene under blir automatisk lagt til fra forelderklassene, og trenger ikke å være med
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    image = models.URLField(max_length=600, null=True, blank=True)
    image_alt = models.CharField(max_length=200, null=True, blank=True)
```

Da har vi opprettet attributtene for to modeller. Beskrivelse for hvert felt er kommentert i kodeboksen over.

### Konfigurering av rettigheter
Hittil har vi satt default rettigheter, men vi har ikke spesifisert på et mer detaljert nivå hvem som skal få lov til å gjøre hva. Denne delen er litt mer innviklet å forstå og kan virke som mye kode for liten grunn. Det er viktig at du leser ***Seksjonen om Rettigheter*** for å forstå hvorfor vi gjør dette. Men kort fortalt må man først sette hvilke rettigheter som er tilegnet hvem på overordnet nivå, og deretter for et spesifikt objekt / instans.

Vi starter med rettighetene for Blogg:

```python
class Blog(...):
    ...
    write_access = (AdminGroup.HS, )
    read_access = (Groups.TIHLDE, )

    """
    I dette tilfellet for alt som omgår oppretting, oppdatering og 
    sletting så vil vi at kun ledere for undergrupper skal kunne 
    gjøre dette for en blogg. Dermed kan vi bare benytte oss av
    default has_write_permission metoden fra 
    BasePermissionModel klassen for alle metodene, siden vi har
    satt default rettighet til at kun HS skal ha write_access.
    """

    @classmethod
    def has_write_permission(cls, request):
        return cls.has_write_permission(request)
    
    @classmethod
    def has_update_permission(cls, request):
        return cls.has_write_permission(request)
    
    @classmethod
    def has_destroy_permission(cls, request):
        return cls.has_write_permission(request)

    def has_object_update_permission(cls, request):
        return cls.has_write_permission(request)
    
    def has_object_delete_permission(cls, request):
        return cls.has_write_permission(request)
    
    """
    Det samme gjelder for lesing av blogger. Alle medlemmer av TIHLDE
    skal kunne se en liste over og detaljer om en blogg.
    """

    @classmethod
    def has_read_permission(cls, request):
        return cls.has_read_permission(request)
    
    @classmethod
    def has_retrieve_permission(cls, request):
        return cls.has_read_permission(request)
    
    def has_object_retrieve_permission(cls, request):
        return cls.has_read_permission(request)

```

Blogg modellen var ganske basic og krevde ikke noe spesiell logikk for å håndtere rettigheter. Men det vil vi derimot se for selve innleggene til bloggene. Her må vi sjekke at kun medlemmer av gruppen som har laget bloggen får lov til å håndtere redigering av innlegg.

```python
class Entry(...):
    ...
    write_access = (AdminGroup.HS, )
    read_access = (Groups.TIHLDE, )

    """
    Her ser vi at det krever mer logikk som vi må kode selv.
    Vi bruker egne definerte metoder, men de går vi ikke inn på her.
    Det finnes eksempler i kodebasen på hvordan man gjør dette,
    og det vil også fremkomme eksempler i senere dokumentasjon.
    Poenget her er at vi har oppnådd å verifisere om brukeren
    har rett til å skrive, slette og oppdatere et innlegg.
    Først sjekkes det på et overordnet nivå om brukeren er medlem
    av en gruppe som kan opprette innlegg,
    og deretter sjekk om brukeren tilhører gruppen som eier bloggen
    som innlegget er en del av.
    """

    @classmethod
    def has_write_permission(cls, request):
        return (
            cls.has_write_permission(request)
            or request.user.memberships_with_blog_entries_access.exists()
        )
    
    @classmethod
    def has_update_permission(cls, request):
        return cls.has_write_permission(request)
    
    @classmethod
    def has_destroy_permission(cls, request):
        return cls.has_write_permission(request)
    
    def has_object_write_permission(self, request):
        return (
            self.has_write_permission(request) or
            self.check_request_user_has_access_through_blog_group(
                request.user, self.blog.group
            )
        )
    
    def has_object_update_permission(self, request):
        return self.has_object_write_permission(request)
    
    def has_object_destroy_permission(self, request):
        return self.has_object_write_permission(request)
    
    @classmethod
    def has_read_permission(cls, request):
        return cls.has_read_permission(request)
    
    @classmethod
    def has_retrieve_permission(cls, request):
        return cls.has_read_permission(request)
    
    def has_object_retrieve_permission(cls, request):
        return cls.has_read_permission(request)

```

## Oppsett av Serializer
Fra og med nå så forholder vi oss til at det allerede eksisterer en instans av *Blogg* og så forholder vi oss til *Entry*. 

Neste steg er dermed å opprette en **Serializer** som skal hjelpe oss med å omgjøre fra en instans av en klasse, til JSON format som vi kan sende tilbake til frontend.

### Arv og fields
Vi skal lage flere typer serializere. Vi velger også å arve fra vår egen klasse *BaseModelSerializer* siden den arver Django sin Serializer klasse, samtidig som den håndterer oppdatering av bilde. Det er ikke i alle tilfeller at vi benytter oss av et bilde for modellen vår, men det er greit å bruke den for det siden den ikke påvirker noe annet.

```python
class EntrySerializer(BaseModelSerializer):
    author = SimpleUserSerializer(read_only=True)
    blog = BlogSerializer(read_only=True)

    class Meta:
        model = Entry
        fields = (
            "id",
            "title",
            "ingress",
            "body",
            "author",
            "blog",
            "image",
            "image_alt",
            "created_at",
            "updated_at"
        )

class EntryListSerializer(BaseModelSerializer):
    author = SimpleUserSerializer(read_only=True)
    
    class Meta:
        model = Entry
        fields = (
            "id",
            "title",
            "ingress",
            "author",
            "image",
            "image_alt",
            "created_at",
            "updated_at"
        )

class EntryCreateSerializer(BaseModelSerializer):
    class Meta:
        model = Entry
        fields = (
            "title",
            "ingress",
            "body",
            "image",
            "image_alt",
            "blog"
        )
    
    def create(self, validated_data):
        author = self.context["request"].user
        entry = Entry.objects.create(**validated_data, author=author)
        return entry


class EntryUpdateSerializer(BaseModelSerializer):
    class Meta:
        model = Entry
        fields = (
            "id",
            "title",
            "ingress",
            "body",
            "image",
            "image_alt",
        )
```

Her ser vi hvordan vi har laget fire forskjellige Serializere:

* EntrySerializer: Her har vi laget en serializer for når man skal hente ut kun en instans av Entry. Dermed får man hentet ut all data, og man henter også ut data om forfatter og bloggen, som er to andre serializere som er laget fra før.
* EntryListSerializer: Her har vi laget en serializer for når man skal hente ut en liste med instanser av Entry. Dermed ønsker vi ikke å hente alt for mye data, og dropper blant annet *blog* og *body*. 
* EntryCreateSerializer: Her overkjører vi create metoden for å kunne sette author til å være brukeren som prøver å lage et innlegg. Merk at vi kun skriver inn *blog* som et felt, og ikke må håndtere å finne ut hvilken blog det er. Django vil selv håndtere dette feltet ved å sjekke om id for *Blog* som blir sendt inn er en eksisterende id.
* EntryUpdateSerializer: Her setter vi inn kun de attributtene som er nødvendige for å gjøre en oppdatering av innlegget. Vi ønsker ikke at forfatter og blogg skal kunne endres etter den først er laget.


## Oppsett av ViewSet
Nå som vi har laget både en modell og en serializer, kan vi lage selve endepunktene for å opprette, oppdatere, slette og hente ut instanser.

### Oppsett av klasse
```python
class EntryViewSet(BaseViewSet):
    queryset = Entry.objects.all()
    permission_classes = [BasicViewPermission]
    pagination_class = BasePagination

    search_fields = [
        "title",
        "author__first_name",
        "author__last_name",
        "author__user_id",
    ]

    serializer_class = EntrySerializer

    def get_serializer_class(self):
        if hasattr(self, "action") and self.action == "list":
            return MinuteListSerializer
        return super().get_serializer_class()
```

Vi setter opp en klasse for Entry sitt ViewSet ved å arve vår egendefinerte klasse **BaseViewSet**. Videre setter vi opp **BasicViewPermission** for å håndtere rettigheter som vi satte opp i modellen vår. Vi legger også ved **BasePagination** siden vi ønsker paginering. Vi legger også ved muligheten for å kunne søke etter innlegg basert på tittel og informasjon om forfatter. Videre er vårt **queryset** satt som default å hente ut alle instanser. 

Til slutt har vi satt vår **EntrySerializer** som default. Men vi legger også ved en **get_serializer_class** metode som gjør at vi kan endre vår serializer basert på om det er en GET request for list, siden vi da ønsker en annen type serializer.

Videre skal vi se på hvordan man setter opp endepunkter, og du vil se at ved å benytte oss av en god arkitektur med modeller og serializere, er det behov for veldig lite kode i selve ViewSettet.

### POST
```python
def create(self, request, *args, **kwargs):
    try:
        data = request.data
        serializer = EntryCreateSerializer(
            data=data,
            context={"request": request}
        )
        if serializer.is_valid():
            entry = super().perform_create(serializer)
            serializer = EntrySerializer(entry)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            {"detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception:
        return Response(
            {"detail": "Det oppsto en intern serverfeil"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

Vår create metode som skal håndtere POST forespørsler setter vi opp ved å anvende vår **EntryCreateSerializer** for å opprette en ny instans av *Entry*. 

### PUT
```python
def update(self, request, *args, **kwargs):
    try:
        entry = self.get_object()
        serializer = EntryUpdateSerializer(
            entry, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            entry = super().perform_update(serializer)
            serializer = EntrySerializer(entry)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            {"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )
    except Exception:
        return Response(
            {"detail": "Det oppsto en intern serverfeil"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

Vår update metode som skal håndtere PUT forespørsler setter vi opp ved å anvende vår **EntryUpdateSerializer** for å oppdatere en eksisterende instans av *Entry*.

## DELETE
```python
def destroy(self, request, *args, **kwargs):
    try:
        super().destroy(request, *args, **kwargs)
        return Response(
            {"detail": "Inlegget ble slettet"},
            status=status.HTTP_200_OK
        )
    except Exception:
        return Response(
            {"detail": "Det oppsto en intern serverfeil"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

Vår destroy metode som skal håndtere DELETE forespørsler setter vi opp ved å anvende ved å kalle på metoden vi har arvet, men vi endrer på statuskoden.

## GET
Siden dette eksempelet ikke er noe komplekst, så holder vi oss til å ikke definere metodene **list** og **retrieve** siden vi kun skal benytte oss av et queryset og serializer som vi allerede har definert for å velge ut data.

## Uthenting av innlegg for en spesifikk blogg
Hittil har vi latt være å røre vår list funksjon. Dette kommer av at vi ønsker å ha mulighet til å se alle *Entry* instanser uten å måtte filtrere på blogg. Men vi ønsker også en måte å hente ut instanser som er tilknyttet en spesifikk blogg. 

Det er to måter å gjøre dette på; enten ved hjelp av filtrering eller ved å opprette et egendefinert endepunkt. Først skal vi se på hvordan man lager et eget endepunkt:

```python
@action(
    detail=False,
    methods=["GET"],
    url_path=r"blog/(?P<blog_id>\d+)"
)
def blog_entries(self, request, blog_id):
    try:
        blog = Blog.object.filter(id=blog_id).first()

        if not blog:
            return Response(
                {"detail": "Fant ikke blog."},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        entries = Entry.objects.filter(blog=blog)

        serializer = EntryListSerializer(
            entries,
            context={"request": request},
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
    except Exception:
        return Response(
            {"detail": "Det skjedde en feil på serveren."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
```

I dette tilfellet ser vi hvordan vi setter url'en til å legge ved en id for bloggen og deretter finner ut om den eksisterer. Deretter filtrerer vi ut *Entry* instanser som er assosiert med denne bloggen. Dette er en litt tungtvint metode å bruke for å hente ut inlegg til en blogg. Ved noen anledninger så er det behov for å utføre mye mer logikk som er vanskelig basert på et filter, og da er dette en bedre metode.

Men i vårt eksempel så skal vi se hvordan dette kan bli gjort lettere ved hjelp av filtrering.

```python
class EntryViewset(...):
    ...

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["blog"]

    ...
```

Siden vårt filter er så enkelt som et slikt frontend kall:

```js
const response = await fetch(
    "https://api.tihlde.org/entries/?blog=1/"
)
```

så er det er bare å sette inn blog som **filterset_fields** så vil **DjangoFilterBackend** sørge for at en GET list kall vil returnere kun innlegg som tilhører blog med tilsvarende id 1.


### Konfigurering av URL
Nå som vi har opprettet flere endepunkt må vi bestemme oss for hvordan man skal kunne kalle på disse. Det gjør man ved å navigere til url.py i appen du befinner deg i.

```python
from django.urls import re_path
from rest_framework import routers

from app.content.views import (
    EntryViewSet,
)

router = routers.DefaultRouter()

# Register content viewpoints here
router.register("entries", EntryViewSet)

urlpatterns = [
    re_path(r"", include(router.urls))
]
```

Nå har vi satt vårt endepunkt for *Entry* til å være på https://api.tihlde.org/entries/.


## Testing av kode
Det siste vi må gjøre før vi kan si oss ferdig med et prosjekt er å lage tester for koden. Vi ønsker å teste så mye som mulig før man prøver å integrere de nye endepunktene i frontend, slik at det ikke blir mye surr frem og tilbake mellom backend og frontend. Man vil aldri kunne teste for alt, men ved hjelp av integrasjonsstester får vi testet at våre endepunkt fungerer som tiltenkt.


Vi skal ikke gå veldig detaljert inn i testing her, men vi skal se på et par eksempler:

```python
@pytest.mark.django_db
def test_create_entry_as_member(member):
    """A normal member should be not able to create an entry"""
    url = API_ENTRY_BASE_URL
    client = get_api_client(user=member)
    data = get_entry_post_data()
    response = client.post(url, data)

    assert response.status_code == status.HTTP_403_FORBIDDEN
```

Her kjører vi en test ved hjelp av **pytest** som sjekker om et vanlig medlem av TIHLDE har lov til å opprette en tekst, og det vet vi at den ikke har.

```python
@pytest.mark.django_db
@pytest.mark.parametrize("group_name", AdminGroup.all())
def test_create_entry_as_member_of_blog_owner_group(member, group_name):
    """A member of the group that owns the blog
    should be able to create an entry"""
    add_user_to_group_with_name(member, group_name)
    url = API_ENTRY_BASE_URL
    client = get_api_client(user=member)
    data = get_entry_post_data()
    response = client.post(url, data)

    assert response.status_code == status.HTTP_200_OK
```

Her tester vi om alle medlemstyper av AdminGroup.all() (alle undegrupper + HS) har mulighet til å opprette et innlegg som tilhører en blogg som tilhører deres egen gruppe. Dette skal være mulig.
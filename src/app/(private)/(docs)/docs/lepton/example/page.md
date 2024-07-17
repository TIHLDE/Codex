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

---
title: 'Verifisering med Feide'
---

Når du oppretter en bruker hos TIHLDE så må du først registrere en bruker med gitt informasjon, og så må en fra HS eller Index godkjenne at din bruker faktisk tilhører et av studiene til TIHLDE.

Dette er en metode vi har benyttet oss av i flere år, men som vi anser som tungvint og lite tidseffektivt. Dermed har det vært et behov for å automatisere denne prosessen. Dette kan man gjøre ganske enkelt ved hjelp av [Feide sitt api](https://docs.feide.no/reference/apis/feide-api/index.html).

Siden vi kun ønsker å verifisere om brukeren tilhører et av TIHLDE sine studier, men ikke bruke det som innloggingsmetode, så er et oppsett av dette ganske fort gjort.

## Bruker har to valg
Vi ønsker å gi en bruker som ønsker å registere en bruker, to valg. Enten kan man opprette en bruker automatisk ved å logge seg inn med Feide, og så vil Lepton ta hånd om resten. Dette er det vi ønsker at brukere gjør. Men hva hvis det skjer en feil med innloggingen med Feide eller kanskje en ny student ikke har fått Feide konto enda? Dermed må vi fortsatt beholde vår gamle registreringsmetode.

## Hvordan bruke Feide som verifisering
Denne dokumentasjonen er basert på Feide sin egen dokumentasjon som du kan lese mer om [her](https://docs.feide.no/service_providers/openid_connect/feide_obtaining_tokens.html#registering-your-application). Hvis det skal utbedres til å integrere selv innloggingsprosessen med Feide, krever det en bedre kjennskap med dokumentasjonen til Feide, enn det vi går gjennom her.


### Inlogging
Det første steget for å benytte seg av Feide, er å gi brukeren mulighet til å logge inn med Feide. Dette er en ganske enkel prosess, ved å la bruker trykke på en knapp som sender brukeren til følgende url:

```
https://auth.dataporten.no/oauth/authorization?
client_id=<our_feide_client_id>&
response_type=code&
redirect_uri=https://tihlde.org/ny-bruker/feide&
scope=openid&
state=whatever
```

Dette vil redirecte brukeren til Feide sin egen innloggingsside som du mest sannsynlig er kjent med.

![Feide innlogging](https://docs.feide.no/_images/enter_credentials_in_feide_login.png)

Etter at bruker har logget inn med riktig Feide brukernavn og passord, blir brukeren sendt tilbake til vår redirect_url:

```
HTTP/1.1 302 Found
Location: https://tihlde.org/ny-bruker/feide?
code=0f8cf5fa-dc3f-4c9d-a60c-b6016c4134fa&
state=f47282ec-0a8b-450a-b0da-dddb393fbeca
```

Her ser vi at **code** er en token som varer i 10 min (dette er maks tid, og er usikkert om Feide bruker denne tiden eller mindre).


### Autentisering med Lepton
Det er nå på tide å koble inn Lepton. Ved å benytte oss av **code** parameteret har vi mulighet til å hente ut en access_token for brukeren. Dermed sender vi en POST request til LEPTON API'et til **/feide/** med code som en del av body.


```python
@api_view(["POST"])
def register_with_feide(request):
    """Register user with Feide credentials"""
    try:
        serializer = FeideUserCreateSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.create(serializer.data)
            return Response(
                {"detail": DefaultUserSerializer(user).data},
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        if isinstance(e, FeideError):
            return Response(
                {"detail": e.message},
                status=e.status_code,
            )

        return Response(
            {"detail": "Det skjedde en feil på serveren"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
```

Vi benytter oss av dekoratøren **api_view** for å opprette en funksjon for vårt endepunkt. Vi har ingen behov for noen aksesskontroll siden man ikke har en bruker allerede når man skal registrere seg.

```python
class FeideUserCreateSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=36)

    def create(self, validated_data):
        code = validated_data["code"]

        access_token, jwt_token = get_feide_tokens(code)
        full_name, username = get_feide_user_info_from_jwt(jwt_token)

        existing_user = User.objects.filter(user_id=username).first()
        if existing_user:
            raise FeideUserExistsError()

        groups = get_feide_user_groups(access_token)
        group_slugs = parse_feide_groups(groups)
        password = generate_random_password()

        user_info = {
            "user_id": username,
            "password": make_password(password),
            "first_name": full_name.split()[0],
            "last_name": " ".join(full_name.split()[1:]),
            "email": f"{username}@stud.ntnu.no",
        }

        user = User.objects.create(**user_info)

        self.make_TIHLDE_member(user, password)

        for slug in group_slugs:
            self.add_user_to_study(user, slug)

        return user
```

Vi benytter en egen **FeideSerializer** for å validere **code** som vi sender fra frontend. Denne må være nøyaktig 36 bokstaver lang.


### Uthenting av Feide token
Selv om vi har validert lengde og type for **code**, er det ikke sikkert den er riktig. Dette finner vi ut ved å benytte oss av **get_feide_tokens** metoden vår.

```python
def get_feide_tokens(code: str) -> tuple[str, str]:
    """Get access and JWT tokens for signed in Feide user"""

    grant_type = "authorization_code"

    auth = HTTPBasicAuth(username=FEIDE_CLIENT_ID, password=FEIDE_CLIENT_SECRET)

    payload = {
        "grant_type": grant_type,
        "client_id": FEIDE_CLIENT_ID,
        "redirect_uri": FEIDE_REDIRECT_URL,
        "code": code,
    }

    response = requests.post(url=FEIDE_TOKEN_URL, auth=auth, data=payload)

    if response.status_code == 400:
        raise FeideUsedUserCode()

    if response.status_code != 200:
        raise FeideGetTokenError()

    json = response.json()

    if "access_token" not in json or "id_token" not in json:
        raise FeideTokenNotFoundError()

    return (json["access_token"], json["id_token"])
```

Her benytter vi oss av Feide sitt API for å hente ut **access_token** og **id_token** (JWT) om innlogget bruker. Hvis denne forespørselen går gjennom vet vi at bruker er logget inn og autentisert gjennom Feide.

### Dekoding av JWT
```python
full_name, username = get_feide_user_info_from_jwt(jwt_token)
```

Neste steg er å dekode **id_token** fra forrige metode. JWT er en kjent metode man benytter for å autentisere en brukere, ved å sende ved informasjon i token. Du kan lese mer om [JWT her](https://jwt.io/introduction).

```
{
    "iss": "https://auth.dataporten.no",
    "jti": "f95ed523-b9b2-42e7-b193-a08143d9f342",
    "aud": "5ac8753f-8296-41bf-b985-59d89769005e",
    "sub": "76a7a061-3c55-430d-8ee0-6f82ec42501f",
    "iat": 1635509702,
    "exp": 1635513302,
    "auth_time": 1635505713,
    "nonce": "PLt3i3bT2~xTw7m",
    "email": "jon.kare.hellan@uninett.no",
    "name": "Jon Kåre Hellan",
    "picture": "https://api.dataporten.no/userinfo/v1/user/media/p:c0050004-386e-4c58-9073-e37344bc8769",
    "https://n.feide.no/claims/userid_sec": [
        "feide:jk@uninett.no"
    ],
    "https://n.feide.no/claims/eduPersonPrincipalName": "jk@uninett.no",
    "at_hash": "DiafctHGah2reptMDjEqUg"
}
```

Her ser vi et eksempel fra Feide sin [dokumentasjon](https://docs.feide.no/reference/tokens.html) som viser hva man kan hente ut av JWT token som vi har hentet ut. Vi har kun behov for to ting; brukernavn og fullt navn.


```python
import jwt


def get_feide_user_info_from_jwt(jwt_token: str) -> tuple[str, str]:
    """Get Feide user info from jwt token"""
    user_info = jwt.decode(jwt_token, options={"verify_signature": False})

    if (
        "name" not in user_info
        or "https://n.feide.no/claims/userid_sec" not in user_info
    ):
        raise FeideUserInfoNotFoundError()

    feide_username = None
    for id in user_info["https://n.feide.no/claims/userid_sec"]:
        if "feide:" in id:
            feide_username = id.split(":")[1].split("@")[0]

    if not feide_username:
        raise FeideUsernameNotFoundError()

    return (user_info["name"], feide_username)
```
Ved å benytte oss av Python sin jwt dependency kan vi dekode vår token. Her ønsker vi å hente ut **name** for fullt navn, og iterere gjennom bruker sine **bruker id'er** og finne den som tilhører Feide.


### Validering av studie
Nå som vi har informasjon om brukeren, må vi finne ut om brukeren faktisk går på et studie som tilhører TIHLDE. Vi ønsker ikke å gi tilgang til noen andre studier utenfor TIHLDE.

```python
groups = get_feide_user_groups(access_token)
group_slugs = parse_feide_groups(groups)
```

Først må vi bruke Feide sitt API igjen for å hente ut gruppene til brukeren ved hjelp av brukeren sin **access_token**.

```python
def get_feide_user_groups(access_token: str) -> list[str]:
    """Get a Feide user's groups"""

    response = requests.get(
        url=FEIDE_USER_GROUPS_INFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    if response.status_code != 200:
        raise FeideGetUserGroupsError()

    groups = response.json()

    if not groups:
        raise FeideUserGroupsNotFoundError()

    return [group["id"] for group in groups]  # Eks: fc:fs:fs:prg:ntnu.no:ITBAITBEDR
```
Vi sender en GET request for å hente gruppene ved deretter å filtrere gruppene:

```pyhton
def parse_feide_groups(groups: list[str]) -> list[str]:
    """Parse groups and return list of group slugs"""
    program_codes = [
        "BIDATA",
        "ITBAITBEDR",
        "BDIGSEC",
        "ITMAIKTSA",
        "ITBAINFODR",
        "ITBAINFO",
    ]
    program_slugs = [
        "dataingenir",
        "digital-forretningsutvikling",
        "digital-infrastruktur-og-cybersikkerhet",
        "digital-samhandling",
        "drift-studie",
        "informasjonsbehandling",
    ]

    slugs = []

    for group in groups:

        id_parts = group.split(":")

        group_code = id_parts[5]

        if group_code not in program_codes:
            continue

        index = program_codes.index(group_code)
        slugs.append(program_slugs[index])

    if not len(slugs):
        raise FeideParseGroupsError()

    return slugs
```
Hvis studenten ikke tilhører ett av våre studier kaster vi en feil og nekter adgang.

### Brukerinformasjon
```python
password = generate_random_password()

user_info = {
    "user_id": username,
    "password": make_password(password),
    "first_name": full_name.split()[0],
    "last_name": " ".join(full_name.split()[1:]),
    "email": f"{username}@stud.ntnu.no",
}

user = User.objects.create(**user_info)
```

Neste steg er å lage selve brukeren. Siden vi ikke ønsker at alle nye brukere skal ha likt passord, og som vi som utviklere vet om, så genererer vi et sikkert og tilfeldig passord med en lengde på 12 bokstaver slik:

```python
def generate_random_password(length=12):
    """Generate random password with ascii letters, digits and punctuation"""
    characters = string.ascii_letters + string.digits + string.punctuation

    password = "".join(secrets.choice(characters) for _ in range(length))

    return password
```


### Gi bruker tilgang
Nå som brukeren er laget, må vi ha en måte å levere passordet til brukeren. Vi velger å sende passordet ved hjelp av mail:

```python
def make_TIHLDE_member(self, user, password):
    TIHLDE = Group.objects.get(slug=Groups.TIHLDE)
    Membership.objects.get_or_create(user=user, group=TIHLDE)

    Notify(
        [user], "Velkommen til TIHLDE", UserNotificationSettingType.OTHER
    ).add_paragraph(f"Hei, {user.first_name}!").add_paragraph(
        f"Din bruker har nå blitt automatisk generert ved hjelp av Feide. Ditt brukernavn er dermed ditt brukernavn fra Feide: {user.user_id}. Du kan nå logge inn og ta i bruk våre sider."
    ).add_paragraph(
        f"Ditt autogenererte passord: {password}"
    ).add_paragraph(
        "Vi anbefaler at du bytter passord ved å følge lenken under:"
    ).add_link(
        "Bytt passord", "/glemt-passord/"
    ).add_link(
        "Logg inn", "/logg-inn/"
    ).send(
        website=False, slack=False
    )
```

Først lager vi et medlemskap i TIHLDE for brukeren, slik at den har mulighet til å logge inn. Deretter sender vi en mail med brukernavn og passord. Vi ønsker ikke at bruker skal bruke det genererte passordet siden det står i klartekst i en mail, og dermed er en sikkerhetsrisiko. Dermed legger vi ved en link til nettsiden for å resette passordet til et passord brukeren selv velger.

### Studie og årskull
Til slutt må vi legge den opprettede brukeren til sitt riktige studie og kull.

```python
def add_user_to_study(self, user, slug):
    study = Group.objects.filter(type=GroupType.STUDY, slug=slug).first()
    study_year = get_study_year(slug)
    class_ = Group.objects.get_or_create(
        name=study_year, type=GroupType.STUDYYEAR, slug=study_year
    )

    if not study or not class_:
        return

    Membership.objects.create(user=user, group=study)
    Membership.objects.create(user=user, group=class_[0])
```

Siden Feide API'et kun gir tilgang til navn på studie, men ikke årskull så antar vi at brukeren er ny, og setter dem dermed til følgende år med følgende metode:

```python
def get_study_year(slug: str) -> str:
    today = datetime.today()
    current_year = today.year

    # Check if today's date is before July 20th
    if today < datetime(current_year, 7, 20):
        current_year -= 1

    if slug == "digital-samhandling":
        return str(current_year - 3)

    return str(current_year)
```

I tillegg så trekker vi fra 3 år hvis studiet er Digital Transformasjon siden de i praksis starter i 4. klasse.


## Konklusjon
Du har nå sett hvordan vi setter opp automatisk registrering av brukere ved hjelp av Feide. Dette er en funksjonalitet som fører til drastisk reduksjon av manuelt arbeid for HS og Index. I tillegg så er det positivt at brukere sin e-post blir satt til skole e-posten. Dette fører til at flere får med seg beskjeder siden de bruker skole e-posten sin aktivt.
---
title: "Feilhåndtering for endepunkter"
---

Når vi skal lage våre endepunkter ved hjelp av Viewsets, er det mye som kan gå galt i koden. Derfor er det viktig for ethvert API å håndtere mulige feil og returnere en respons til frontend med riktig statuskode og en logisk melding.

## En lang rekke med håndteringer
I et Viewset så legger vi til grunn at vi skal sette opp feilhåndtering som tar høyde for alle mulige feil som default.

```python
@action(
    detail=True,
    methods=["post"],
    url_path="/feide"
)
def register_with_feide(self, request, *args, **kwargs):
    """Register user with Feide credentials"""
    try:
        serializer = FeideUserCreateSerializer(data=request.data)

        if serializer.is_valid():
            user = super().perform_create(serializer)
            return Response(
                {"detail": DefaultUserSerializer(user).data},
                status=status.HTTP_201_CREATED,
            )
        
        return Response(
            {"detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception:
        return Response(
            {"detail": "Det skjedde en feil på serveren"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
```

Her ser vi hvordan vi gir en tilbakemelding til frontend om hva som har skjedd hvis det oppstår en feil vi ikke har tatt høyde for. Men inni vår **create** metode i vår serializer så er det mer logikk som kan feile underveis, og da er det greit å gi en mer detaljert beskjed til frontend om hva som har skjedd. I Python er det mulig å bruke nøkkelordet **exception** flere ganger etter hverandre for flere ulike typer.

```python

except Exception:
    return Response(
        {"detail": "Det skjedde en feil på serveren"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
except APIFeideTokenNotFoundException:
    return Response(
        {"detail": "Fant ikke en token"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
except APIFeideGetTokenException:
    return Response(
        {"detail": "Det skjedde en feil med Feide sitt API"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )

...
```

Her ser man at dette fort kan bli mange exceptions etter hverandre, og det er lett at man glemmer å ta hånd om de ulike feilene man kaster gjennom forskjellige metoder og filer.

## La Viewsetet håndtere feil for deg
Heldigvis har vi en type klasse vi kan lage som vi kan la vårt Viewset arve, slik at vi ikke trenger å sette opp en lang liste med exceptions.

```python
class APIErrorsMixin:
    """
    Mixin that transforms Django and Python exceptions into rest_framework ones.
    without the mixin, they return 500 status code which is not desired.
    """

    _expected_exceptions = {
        ValidationError: rest_exceptions.ValidationError,
        PermissionError: rest_exceptions.PermissionDenied,
    }

    def handle_exception(self, exc):
        if isinstance(exc, tuple(self.expected_exceptions.keys())):
            drf_exception_class = self.expected_exceptions[exc.__class__]
            drf_exception = drf_exception_class(get_error_message(exc))

            return super().handle_exception(drf_exception)

        return super().handle_exception(exc)

    @property
    def expected_exceptions(self):
        return self._expected_exceptions
```

Dette er en egendefinert klasse som vi har laget selv. Denne lar oss returnere responser med en riktig tilpasset statuskode og melding.

```python
class APIFeideUserErrorsMixin(APIErrorsMixin):
    @property
    def expected_exceptions(self):
        return {
            **super().expected_exceptions,
            FeideUsernameNotFoundError: APIFeideUserNameNotFoundException,
            FeideTokenNotFoundError: APIFeideTokenNotFoundException,
            FeideUserGroupsNotFoundError: APIFeideUserGroupsNotFoundException,
            FeideUserInfoNotFoundError: APIFeideUserInfoNotFoundException,
            FeideGetTokenError: APIFeideGetTokenException,
            FeideGetUserInfoError: APIFeideGetUserInfoException,
            FeideGetUserGroupsError: APIFeideGetUserGroupsException,
            FeideParseGroupsError: APIFeideParseGroupsException
        }
```

Dette gjør at vi videre kan definere klassen som vårt Viewset skal arve. Det viktigste å ta høyde for her er de ulike klassene som definerer en **Error** og hvilken **APIException** som hører til.

På denne måten kan vi definere egne klasser som både tar høyde for en feil, men også hvilken statuskode og respons feilen skal lede til.

```python
class FeideGetTokenError(ValueError):
    pass

class APIFeideGetTokenException(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Fikk ikke tilgang til Feide sitt API for å hente ut din token. Prøv igjen eller registrer deg manuelt."

# Eksempel utdrag fra en funksjon som henter access token
except Exception:
    raise FeideGetTokenError
```

Her ser vi et eksempel på et par der **FeideGetTokenError** er linket opp mot **APIFeideGetTokenException**. Dette betyr at inni vår logikk som henter ut en access token fra Feide, vil det bli kastet en **FeideGetTokenError**. Dermed blir API kallet til vårt endepunkt brutt som vanlig, bare at nå sendes det ikke en respons med statuskode 500 og en lite forstårlig melding, men heller statuskode 500 (det som passer best her), med en beskrivende forklaring til bruker og hva bruker burde gjøre.

```python
class UserViewSet(..., APIFeideUserErrorsMixin):
    ...
```

Ved å la vårt Viewset arve feilhåndteringsklassen, blir alle feil som vi har definert håndtert automatisk i alle endepunkter.
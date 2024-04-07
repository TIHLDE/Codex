---
title: "Hvordan håndtere filopplastning"
---

I TIHLDE benytter vi oss av Microsoft Azure for å lagre filer. Dette gir medlemmer av TIHLDE muligheten til å laste opp filer som bilder og dokumenter. Dette benytter vi blant annet oss av når vi laster opp bilder for et arrangement eller en nyhet.

## Hvordan laste opp filer via kode

Vi har to filer i Lepton som tar seg av filopplastning.
Den første finner vi i app/common/file_handler.py

```python
class FileHandler(ABC):

    # Ensure that users don't upload very huge files
    SIZE_50_MB = 50_000_000

    @abstractmethod
    def __init__(self, blob=None):
        self.blob = blob

    @abstractmethod
    def get_or_create_container(self, name="default"):
        pass

    def getBlobName(self):
        return self.blob.name if self.blob.name else ""

    def getContainerNameFromBlob(self):
        return (
            "".join(e for e in self.blob.content_type if e.isalnum())
            if self.blob.content_type
            else None
        )

    def checkBlobSize(self):
        if self.blob.size > self.SIZE_50_MB:
            raise ValueError("Filen kan ikke være større enn 50 MB")

    @abstractmethod
    def uploadBlob(self):
        pass
```
Dette er en abstrakt klasse som vi bruker som moderklasse for neste klasse vi skal vise.
Denne klassen har flere metoder vi benytter for å kunne lage en container og en blob som lastes opp til Azure. Du kan lese mer om hva dette er i Microsoft sin [dokumentasjon.](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)

Merk også at det er en metode som sjekker om størrelsen på bilde er større enn 50MB.
```python
def checkBlobSize(self):
    if self.blob.size > self.SIZE_50_MB:
       raise ValueError("Filen kan ikke være større enn 50 MB")
```
Denne størrelsen kommer nok til å bli redusert til en lavere størrelse, både for å spare penger, men også for å opprettholde TIHLDE sine bærekraftsprofil.

Neste fil vi skal se på finner vi i app/common/azure_file_handler.py.

```python
class AzureFileHandler(FileHandler):
    def __init__(self, blob=None, url=None):
        self.blob = blob
        self.url = url
        if url:
            data = self.getContainerAndNameFromUrl()
            self.containerName = data[0]
            self.blobName = data[1]

    def get_or_create_container(self, name="default"):
        connection_string = settings.AZURE_STORAGE_CONNECTION_STRING
        blob_service_client = BlobServiceClient.from_connection_string(
            connection_string
        )
        container = blob_service_client.get_container_client(name)
        if container.exists():
            return container

        container = blob_service_client.create_container(name, public_access="blob")
        return container

    def getContainerAndNameFromUrl(self):
        import urllib.parse

        url = urllib.parse.unquote(self.url)
        # fmt: off
        return re.sub("\w+:\/{2}[\d\w-]+(\.[\d\w-]+)*/", "", url).split("/")  # noqa: W605
        # fmt: on

    def uploadBlob(self):
        "Uploads the given blob to Azure and returns a url to the blob"
        if not self.blob:
            raise ValueError("Du må sende med en blob for som skal lastes opp")

        self.checkBlobSize()
        containerName = self.getContainerNameFromBlob()
        container = self.get_or_create_container(containerName)

        blob_name = f"{uuid.uuid4()}{self.getBlobName()}"

        content_settings = ContentSettings(
            content_type=self.blob.content_type if self.blob.content_type else None,
            cache_control="public,max-age=2592000",
        )

        blob_client = container.get_blob_client(blob_name)
        blob_client.upload_blob(
            data=self.blob.data if hasattr(self.blob, "data") else self.blob,
            content_settings=content_settings,
        )
        if blob_client.url:
            return blob_client.url
        raise ValueError("Noe gikk galt under filopplastningen")

    def deleteBlob(self):
        "Delete a blob by it's url"
        if not self.blobName and not self.containerName:
            raise ValueError("Du kan ikke slette en blob uten en url")

        container = self.get_or_create_container(self.containerName)
        container.delete_blob(self.blobName)
        return f"{self.blobName} har blitt slettet fra {self.containerName}"
```

Denne klassen håndterer filopplastning til Azure ved hjelp av Azure sitt eget python bibliotek. Vi skal ikke gå innom det her, siden dette er et tredjepartsbibliotek som dere kan lese om i Microsoft sin egen dokumentasjon.


## Hvordan bruke AzureFileHandler

Nå skal vi se på hvordan vi kan benytte oss av klassen AzureFileHandler for å laste opp filer. Vi har et eget endepunkt vi benytter oss av når vi laster opp bilder på /upload. Det blir blant annet sendt en forespørsel med et bilde når man legger ved bilde på et arrangement eller en nyhet. Deretter får man returnert en url til bildet (eks. https://leptonstoragedev.blob.core.windows.net/imagepng/4f780d5e-288b-4a29-9a39-448a1d80de98cnbc.png).

```python
@api_view(["POST"])
@permission_classes([IsMember])
def upload(request):
    """Method for uploading files til Azure Blob Storage, only allowed for members"""
    try:
        has_multiple_files = len(request.FILES) > 1
        if has_multiple_files:
            return Response(
                {"detail": "Du kan ikke sende med flere filer"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        no_files = len(request.FILES) < 1
        if no_files:
            return Response(
                {"detail": "Du må sende med en fil i FILE"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        key = list(request.FILES.keys())[0]
        blob = request.FILES[key]
        url = AzureFileHandler(blob).uploadBlob()
        return Response(
            {"url": url},
            status=status.HTTP_200_OK,
        )

    except ValueError as value_error:
        return Response(
            {"detail": str(value_error)},
            status=status.HTTP_400_BAD_REQUEST,
        )
```
Det som er i fokus for denne metoden er at denne håndterer POST requests og vil kun kjøre hvis det er et medlem av TIHLDE som sender inn en fil.

Metoden henter ut vedlagte filer og bruker AzureFileHandler(blob).uploadBlob() til å laste opp minimum en fil.

## Hvordan modeller håndterer filopplastning
Vi har nå sett på hvordan man bruke AzureFileHandler klassen til å laste opp bilder til Azure. Hvis man skal sende en POST forespørsel med en fil må content-type være satt til multipart/form-data istedenfor application/json. Dette gjør det vanskeligere å sende json data samtidig som man sender en fil.

Dermed er det bedre å håndtere filopplastning for seg selv. Et eksempel på dette er når man oppretter en nyhet på frontend. Når man oppretter en nyhet så velger man et bilde og så sendes det en POST request til /upload. Som nevnt returnerer denne en url til bildet, som man sender med POST request til /news, som da legger til url til bildet for modellen.

```python
from app.util.models import BaseModel, OptionalImage
from app.common.permissions import BasePermissionModel


class MyModelWithImage(BaseModel, BasePermissionModel, OptionalImage):
    ...
```

Her lager vi en ny klasse som arver fra OptionalImage. Som vi så i dokumentasjonen om modeller, så vil modellen da få to ny fields - image og image_alt.
Image er her satt til å måtte være en url.

```python
from rest_framework import serializers

from app.common.file_handler import replace_file


class BaseModelSerializer(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        if hasattr(instance, "image") and "image" in validated_data:
            replace_file(instance.image, validated_data.get("image", None))
        return super().update(instance, validated_data)
```
Alle våre serializers arver fra BaseModelSerializer, som vist over. Her ser vi at det er kodet inn en update metode.
Det som skjer her er at det sjekkes om det finnes en ny image-url i den innsendte dataen, og om instansen av modellen allerede har et bilde. Hvis dette er sant, så kjører vi replace_file metoden som fjerner bildet fra Azure. Grunnen til at vi må gjøre dette er fordi når man laster opp et nytt bilde for f.eks. en nyhet, så slettes ikke det gamle bildet. Derfor må vi slette det gamle bildet her før vi oppdaterer url for instansen.

```python
from app.common.serializers import BaseModelSerializer


class MyUpdateSerializer(BaseModelSerializer):
    ...

    def update(self, instance validated_data):
        # Kjør din egen kode
        super().update(instance, validated_data)
```

Her ser vi et eksempel på hvordan vi arver BaseModelSerializer og overkjører update metoden. Det er viktig at hvis man overkjører update metoden så man man kalle på super().update(...) for å sørge for at den eventuelt gamle filen slettes.

## Konklusjon
For å konkludere så er det sjeldent at man trenger å håndtere filopplastning i ditt eget oppsett rundt en modell. Bruk OptionalImage i modellen og BaseModelSerializer i serializer. Deretter håndterer dere filopplastningen på frontend med /upload endepunktet, og deretter sender man returnert bilde url inn til endepunktet for viewsettet.

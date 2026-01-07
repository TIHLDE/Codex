---
title: 'Tilpassete endepunkter'
---

I seksjonen **_Viewsets og responser_** har vi sett på hvordan et basic ViewSet settes opp med arv, attributter og metoder for CRUD. I denne seksjonen skal vi se nærmere på hvordan vi kan legge til flere typer endepunkter som er mer tilpasset spesifikke endepunkter.

## Hva mangler fra de vanlige endpunktene?

Som vist tidligere har vi nå fem endepunkter, GET (list), GET (retrieve), UPDATE (update), DELETE (destroy) og POST (create). For mange scenarioer er dette tilstrekkelig, og er en god start for enhver modell vi har i vår database. Men hva hvis vi ønsker flere endepunkter? Dette er heldigvis mulig å gjøre i samme viewset som resten av endepunktene, og det er ingen begrensning på hvor mange man kan lage.

## Hvordan lage spesifikke endepunkt med dekoraøterer

I dette eksempelet skal vi benytte oss av vårt endepunkt som håndterer **_bannere_**. Et banner er et "reklameskilt" som admins kan sette på forsiden av TIHLDE sidene for å belyse en viktig sak. I dette viewsetet har vi satt vårt _queryset_ attributt til Banner.objects.all(). Dette vil si at default endepunkt for GET forespørselen til list vil returnere alle tilgjengelige bannere. I tillegg har vi satt _BasePagination_ til attributtet _pagination_class_, som gir oss alle bannere fra databasen som en paginert respons. Men vi har et annet tilfelle, der vi ønsker å kunne hente ut kun bannere som er satt til å være synlige i den perioden vi befinner oss i nå.

```python
    @action(
        detail=False,
        methods=["get"],
        url_path="visible",
    )
    def visible(self, request):
        try:
            banner = Banner.objects.filter(
                visible_from__lte=now(), visible_until__gte=now()
            )
            serializer = BannerSerializer(
                banner,
                context={"request": request},
                many=True
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                {"detail": "Det skjedde en feil på serveren"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

Her ser vi et eksempel på hvordan vi bruker det som i Python kalles for **_decorator_**. Du kan lese mer om hva [dette betyr her](https://www.geeksforgeeks.org/decorators-in-python/). I vårt tilfelle med ViewSets i Django, betyr det at vi kan sette opp egne endepunkter. Som man ser fra eksempelet er det tre parametere som sendes inn:

- detail - Dette bestemmer om du skal returnere èn enkelt instans, eller flere. Når det er satt til False, betyr det at GET responsen vil være en liste.
- methods - Dette bestemmer hvilke typer forespørsler som skal bli sendt til denne metoden. Som en vanlig huskeregel setter vi kun en type per funksjon.
- url_path - Dette er hvilken url som skal bli lagt til for å treffe denne metoden. For BannerViewSet er hovedurl satt til /banners/, så i dette tilfellet vil endepunktet ha en url på https://api.tihlde.org/banners/visible/.

## @action med parser

```python
from rest_framework.parsers import FormParser, MultiPartParser


    @action(
        detail=True,
        methods=["post"],
        url_path="mail-gift-cards",
        parser_classes=(
            MultiPartParser,
            FormParser,
        ),
    )
    def mail_gift_cards(self, request, *args, **kwargs):

        event = self.get_object()
        dispatcher = request.user
        files = request.FILES.getlist("file")

        try:
            send_gift_cards_by_email(
                event,
                files,
                dispatcher
            )
            return Response(
                {
                    "detail": "Gavekortene er sendt! Vi vil sende deg en mer utfyllende oversikt til din epost."
                },
                status=status.HTTP_200_OK,
            )
        except EventGiftCardAmountMismatchError as e:
            return Response(
                {"detail": e.message},
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValueError as e:
            capture_exception(e)
            return Response(
                {
                    "detail": f"Noe gikk galt da vi prøvde å sende ut gavekortene. Gi det et nytt forsøk senere eller "
                    f"kontakt Index på {MAIL_INDEX} eller slack."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
```

I de aller fleste tilfeller der frontend skal sende forespørsler til backend, så vil type forespørsel være av JSON format. Det vil si at data som blir sendt via en POST eller UPDATE forespørsel sendes som JSON. Men når det skal sendes filer via et API, må dette behandles annerledes. Her kommer det et nytt parameter inn i @action, nemlig parser_classes. I dette tilfellet er bruker vi to innebygde parser klasser fra Django som håndterer forespørselen og filen(e) som sendes. Dermed har det bli lagt til et attributt _FILES_ på requesten som sendes.

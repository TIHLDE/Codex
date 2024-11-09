---
title: 'Integrering av Vipps betaling'
---

Våren 2023 ble det bestemt at vi skulle integrere Vipps som betalingsløsning for betalende arrangementer. Tidligere ble det manuelt generert QR koder som vi la ved i beskrivelsen av arrangementet. Alle påmeldte fikk opprinnelig 1 time på seg å betale fra de var påmeldt, men siden dette var et manuelt arbeid, hadde påmeldte brukere i realiteten opp til flere dager på seg.

Dette arbeidet krevde mye tid, og det ble fort surr med hvem som hadde betalt og i tide. Derfor bestemte vi oss for å implementere en løsning for å la folk få en tid på seg til å betale et arrangement. Hvis de ikke betalter i tide, blir de automatisk kastet av arrangementet.

## Vipps API

Første steg i å implementere et eksternt API er å bli kjent med API'et. Ved å se på [Vipps sin API spec](https://developer.vippsmobilepay.com/api/ecom/#tag/eCom-API/operation/initiatePaymentV3UsingPOST), så ser vi at det er sett med endepunkter vi kan benytte for å integrere betalinger.

- **Initiate**: Opprettelse av en betaling.
- **Callback**: Vårt endepunkt Vipps kaller på når en ordrestatus oppdateres.
- **Get Payment Details**: Få info om en ordre og status.

## Forlengelse av arrangement

Siden vi ønsket betalinger for arrangementer så implementerte vi en løsning som var spesialtilpasset til arrangementer. Fordelen med dette er at vi kan opprette nye tabeller for andre typer betalinger senere hvis det er behov for det.

```python
class PaidEvent(BaseModel):
    write_access = AdminGroup.admin()

    event = models.OneToOneField(
        Event,
        on_delete=models.CASCADE,
        related_name="paid_information",
        primary_key=True,
    )
    price = models.DecimalField(max_digits=6, decimal_places=2)
    paytime = models.TimeField()

    class Meta:
        verbose_name_plural = "Paid_events"

    def __str__(self):
        return (
            f"Event: {self.event.title} - Price: {self.price} - Paytime: {self.paytime}"
        )
```

Vår løsning var å lage en ny modell for arrangementer som krever betaling. Denne modellen er koblet til et arrangement med et **OneToOneField**. Dermed kan et arrangement kun ha informasjon om ett betalt arrangement.

Informasjonen vi ønsker er prisen for arrangementet, og betalingstid.

## Betalingsordre

```python
class Order(BaseModel, BasePermissionModel):
    order_id = models.UUIDField(
        auto_created=True,
        default=uuid.uuid4,
        primary_key=True,
        serialize=False
    )
    user = models.ForeignKey(
        User,
        null=True,
        on_delete=models.SET_NULL,
        related_name="orders"
    )
    event = models.ForeignKey(
        Event,
        null=True,
        on_delete=models.SET_NULL,
        related_name="orders"
    )
    status = models.CharField(
        choices=OrderStatus.choices,
        default=OrderStatus.INITIATE,
        max_length=16
    )
    payment_link = models.URLField(max_length=2000)
```

**Order** modellen er selve betalingsinformasjonen, og omhandler alle betalingsordre initiert av Vipps. I etterpåklokskap burde denne modellen hete **EventOrder**.

En betalingsordre skal inneholde:

- En ordre id som er PK som vi får fra Vipps.
- En tilknyttet bruker.
- Et tilknyttet arrangement.
- En status for betalingen, slik at vi vet om bruker har betalt eller ikke.
- En url som peker til Vipps for selve betalingen.

### Rettigheter

Ved å se på order.py filen til modellen, vil du se at det er satt opp et sett med rettigheter slik som det blir vist til seksjonen om rettighetsfordeling. Kort fortalt så er rettighetene satt til at ingen brukere kan oppdatere eller slette en betalingsordre, og det er kun grupper som har eierskap til et arrangement som kan se betalingsordre for arrangementet.

## Endring av arrangement påmelding

```python
class Registration(BaseModel, BasePermissionModel):
    ...

    payment_expiredate = models.DateTimeField(null=True, default=None)

    ...
```

En bruker har ikke en direkte kobling til et arrangement. En bruker er koblet til et arrangement via en påmelding. Dermed må vi ha en måte å sjekke om en påmelding har gått forbi sin betlalingstid eller ikke. Derfor legger vi til et **DateTimeField** for **Registration** som tilsier hvor mye tid selve påmeldingen har på seg for å betale. Du kan se på påmeldingen som en representant for brukeren.

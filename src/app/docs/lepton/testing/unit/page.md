---
title: Enhetstester
---

Denne seksjonen blir ganske kort siden vi har dekket det meste i de forrige seksjonene. Men vi skal ta for oss et eksempel på en enkel enhetstest.

Som nevnt er enhetstester for å teste funksjonalitet på et lavere nivå. Så la oss ta for oss en enkel funksjon.

```python
def add(a: int, b: int) -> int:
    return a + b
```

Deretter lager vi en test:

```python
import pytest


@pytest.mark.db_django
@pytest.mark.parametrize(
    "input_a, input_b, correct_answer",
    [
        (1, 2, 3),
        (5, 0, 5),
        (1, "4", None),
        ("1", 4, None)
    ],
)
def test_add_function(
    input_a,
    input_b,
    correct_answer
):
    """"
    Should return correct answer from add().
    If input a or b is not an int, it should
    return None
    """
    answer = add(input_a, input_b)

    assert answer == correct_answer
```

Her har vi laget en test som er paramterisert ved å sende inn et input a, et input b og hva forventet svar er. I følge denne testen vil de to første testene bli godkjent, men ikke de siste.

Hvorfor? Fordi Python ikke godkjenner å legge sammen et heltall og en streng, og dermed vil det bli kastet en feil. Men det er bra. Dette er grunnen til at vi tester. For å finne feil. Vi må dermed rette opp i add() metoden:

```python
def add(a: int, b: int) -> int | None:
    if (
        type(a) != int or
        type(b) != int
    ):
        return None

    return a + b
```

Nå har vi rettet opp i metoden vår for å ta høyde for at input a og b må være riktig type. Hvis vi kjører testen om igjen nå så vil den blir godkjent.

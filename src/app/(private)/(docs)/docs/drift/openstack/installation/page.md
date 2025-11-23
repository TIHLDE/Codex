---
title: 'Første steg'
---

OpenStack er en plattform vi bruker for å opprette virituelle maskiner (VM). Vi har fått tildelt ressurser fra NTNU.

Det er to måter å bruke OpenStack. Den ene er ved å logge inn på OpenStack web-plattformen til NTNU og bruke grensesnittet. Den andre måten er å bruke Command Line Interface (CLI), ved å bruke kommandoer.

Det varierer fra person til person hva man foretrekker å bruke. Men merk at hvis du skal koble en global ruter opp mot en VM så må du bruke CLI. Dette kommer av at vi ikke selv får lov til å opprette globale rutere, siden det er manko på globale IP-adresser. Siden NTNU oppretter de for oss, så klarer ikke OpenStack grensesnittet å forstå at man kan allokere en global ruter til en nyopprettet ruter.

### Enkel oversikt
Her er en enkel oversikt over serverne som vi har i dag, hva de inneholder, og hvordan nettverkstrafikken går gjennom de:

![OpenstackOverview](/public/images/OpenStackOverviewDark.png)

## CLI

### Installering

For å bruke CLI'en må du først installere nødvendig programvare. Hvis du bruker Windows anbefaler vi sterkt at du følger vår guide på å laste ned WSL. Hvis du vil laste ned OpenStack sin CLI på en annen måte, så følg [NTNU sin guide](https://www.ntnu.no/wiki/display/skyhigh/Openstack+CLI+on+Windows).

Ved å bruke Linux (Ubuntu i dette eksempelet) kan du kjøre følgende kommando:

```bash
sudo apt install python3-openstackclient
```

### Innlogging

Neste steg er å autentisere deg opp mot NTNU. For å kunne koble deg opp mot OpenStack er du avhengig av å være logget inn slik at du kan koble deg opp mot et prosjekt du er en del av.

Første steg er å hente ut en **OpenStack RC** fil som er et script som du kan bruke for å autentisere deg selv opp mot ditt prosjekt i OpenStack. Du henter dette ved å gå til [https://stack.it.ntnu.no/horizon/project/api_access/](https://stack.it.ntnu.no/horizon/project/api_access/). Du logger inn med ditt NTNU brukernavn og passord.

På høyre side er det en dropdown meny som heter **Download OpenStack RC File**. Velg den som heter **OpenStack RC File** for å hente ditt script.

Neste steg er å overføre dette scriptet til NTNU sin server. Du må koble til NTNU sin server for å bruke OpenStack. Merk også at du må være koblet til NTNU sitt nettverk (evt med VPN) for å kunne bruke OpenStack.

{% callout title="På egen PC" %}
Hvis du ikke ønsker å jobbe med OpenStack CLI'en via NTNU sin server, kan du hoppe over delen om å overføre til NTNU sin server.

Du kan kjøre OpenStack RC scriptet fra din egen PC og bruke OpenStack. Siden du allerede har lastet ned OpenStack.
{% /callout %}

Ved å bruke WSL kan du bruke følgende kommando for å overføre:

```bash
scp <prosjektnavn>-openrc.sh <brukernavn>@login.stud.ntnu.no:.
```

Du vil bli spurt om ditt NTNU passord.

Etter dette kan du koble deg inn på serveren ved hjelp av SSH:

```bash
ssh <brukernavn>@login.stud.ntnu.no
```

Her må du også skrive inn ditt NTNU passord.

Nå kan du aktivere ditt script som du har flyttet over. På denne måten vil du aktivere en kobling opp mot ditt prosjekt slik at du kan begynne å opprette ressurser.

```bash
# Se alle dine filer
ls -l

# Aktiver script
source <prosjektnavn>-openrc.sh

# Vis alle dine prosjekter
openstack project list

+----------------------------------+----------------------+
| ID                               | Name                 |
+----------------------------------+----------------------+
| 16d6e76a8bff4fdca217170f33b13223 | STUDORG_TIHLDE-Drift |
| a63265774dc24104aed0a5165e323222 | STUDORG_TIHLDE       |
+----------------------------------+----------------------+
```

## Web

Hvis du ønsker å bruke nettsiden til NTNU sin Openstack kan du logge inn med din NTNU bruker på [https://stack.it.ntnu.no/horizon/auth/login/](https://stack.it.ntnu.no/horizon/auth/login/)

---
title: 'Hvordan lage en ny VM'
---

Første steg er å logge inn på NTNU sin [OpenStack plattform](https://stack.it.ntnu.no). Her må du logge inn med din NTNU bruker.

## Valg av prosjekt

Først må du sørge for at du har valgt riktig prosjekt, hvis du tilhører flere enn et prosjekt.

![prosjekt](https://tihldestorage.blob.core.windows.net/codex/project.png)

- STUDORG_TIHLDE: Index sitt prosjekt
- STUDORG_TIHLDE-Drift: Drift sitt prosjekt

## Oppsett av en VM

For å opprette en VM så må du navigere deg frem til oversikt over alle våre instanser. Da går du inn på "Compute" -> "Instances".

Deretter må du trykke på knappen "Launch Instance" i øvre høyre hjørne.

![launch instance](https://tihldestorage.blob.core.windows.net/codex/launch_instance.png)

Nå vil du bli møtt av en popup der du må fylle inn en del innstillinger.

### Details

Det første vinduet du møter er "Details". Her må du fylle ut "Instance Name". Dette er navnet på selve instansen din. Gi et klart og forklarende navn.

### Source

Neste steg er å velge hvilket Image du vil bruke. Dette betyr hvilket operativsystem du vil ha. Her kan du velge mellom Image og Volume. I dette tilfellet skal vi kun se på det å velge et operativsystem. Et volume er ekstra lagringsplass som man kan koble opp til serveren.

Det er 19 forskjellige OS du kan velge mellom, og her er det opp til deg hva du foretrekker. Men det anbefales å se på hvor mye lagringsplass hvert OS tar. Kali bruker f.eks. 20GB siden det kommer med mange filer og verktøy som er laget for etisk hacking.

### Flavor

Flavor er hvilke specs man ønkser å bruke på sin VM. Det vil si hvor mange CPU kjerner, mengde RAM og lagringsplass du vil bruke. Lagringsplass er satt til 40GB for hver flavor, så hvis man trenger mer, må man koble til et volum.

Det er flere ulike typer specs. Men vi anbefaler å følge prinsippet om å starte med lite. Det er mulig å opprgradere specs i senere tid, men det går ikke an å nedgradere. Derfor er det bedre å starte med mindre specs.

### Networks

Nå skal du velge hvilket nettverk du skal bruke. I Drift sitt tilfelle bruker man tihlde-drift, hvis man skal ha et internt nett. Det vil si at du kan koble til VM'en på NTNU sitt nettverk, men ikke fra utsiden. Hvis du ønsker et ekstern nettverk må du følge dokumentasjonen for hvordan man setter opp via CLI. Dette er fordi vi ikke selv har laget det eksterne nettverket, og da klarer ikke OpenStack WEB å forstå at man kan koble til et eksternt nettverk.

### Security Groups

Her velger du din brannmur. En security group er en rekke regler som bestemmer hva slags trafikk som kan komme inn og ut av VM'en. I de fleste tilfeller så velger du **default**. Hvis du trenger andre regler så må du først lage din egen security group.

### Key Pair

Til slutt må du opprette en ssh nøkkel slik at du kan koble deg til serveren ved hjelp av ssh. Enten så kan du lage en egen nøkkel, eller så kan du få OpenStack til å lage en for deg som blir lagret undet "Key Pairs".

### Opprettelse

Det siste som mangler nå er å trykke på "Launch Instance" knappen. Deretter vil det ta litt tid før den er oppe og går.

### Floating IP

Til slutt må du også lage det vi kaller en Floating IP. Det vil si at vi får en IP adresse som man kan bruke for å få tilgang til serveren. Hvis du ikke gjør dette, vil det ikke være noe tilgang til serveren, og man kan blant annet ikke bruke ssh til å komme seg inn.

![floating ip](https://tihldestorage.blob.core.windows.net/codex/floating-ip.png)

Her er det viktig at dere lager en ny Floating Ip, og ikke kobler til en som er brukt før det. Hvis man gjør det så klarer man ikke å koble til VM'en.

![add floating ip](https://tihldestorage.blob.core.windows.net/codex/add.png)

Etter at du har lagt til, så blir automatisk din nye Floating IP lagt til, som fører til at du kan trykke på "Associate".

Du kan nå ssh inn på din nye VM med den Floating IP adressen.

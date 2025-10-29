# Azure Cost Management

Når vi jobber i Azure, må vi hele tiden ha kostnadene i bakhodet. Selv om vi har en **studentkonto** med noe støtte inkludert, er denne kreditten både begrenset og tidsavhengig. Når den er brukt opp, eller perioden er slutt, må kontoen oppgraderes til en **Pay-as-you-go-modell**. Det betyr at man betaler for de ressursene man faktisk bruker, uten faste forhåndsbetalinger. Dette er den eneste betalingsmodellen vi har tilgang til – andre alternativer som Reserved Instances eller Azure Spot Instances er ikke tilgjengelig for oss. 

## Tags – hvorfor de er kritiske

Som vi har sett tidligere, er **tags** helt sentrale for organisering i Azure. Nå kan vi tydeliggjøre hvorfor dette er så viktig i sammenheng med kostnader.

Uten tags blir kostnadsrapportene i **Cost Management \+ Billing** uoversiktlige. Da ser vi bare at “Azure har fakturert X kroner for compute” eller “Y kroner for lagring,” uten at vi kan koble det til et spesifikt prosjekt, miljø eller team. Når vi i stedet konsekvent tagger med ting som `team=drift` eller `env=dev`, kan vi i ettertid bryte ned regningene: Hvilke prosjekter koster mest? Hvilke miljøer drar flest ressurser? 

### **Challenge\!**  
**Med Azure Portal:** Sjekk ut Cost Management. Filtrer etter ressurser eller tags ved å bruke “Add filter”. Klarer du å se hvor mye vi har brukt på “blob storage”?

Linken er: [Home \- Microsoft Azure](https://portal.azure.com/#home)
## Ressursbruk og tommelfingerregler

Kostnadsstyring handler ikke bare om tagging, men også om hvordan vi bruker ressursene. Her er noen viktige erfaringer:

* **Rydd opp etter deg:** Husk å kjøre `terraform destroy` når du er ferdig. En App Service eller Container Instance som står igjen, kan koste lite per dag, men over tid spiser det av budsjettet.

* **Storage Accounts:** Disse er blant de rimeligste ressursene, særlig hvis de brukes til Terraform-state eller enkle backuper. Men de er ikke helt “gratis”: kostnader knytter seg til lagringsvolum, antall operasjoner, og egress-data. Så lenge volum og bruksmønster er lavt, vil regningen likevel være minimal.

* **Ingress vs egress:** Det er gratis å sende data **inn** i Azure (ingress), men å sende data **ut** (egress) koster. Det betyr at det er uproblematisk å hente inn eksterne ting, men å levere store datamengder til sluttbrukere utenfor Azure kan bli dyrt. Overføringer internt i samme region er ofte gratis, men flytting mellom regioner eller Availability Zones kan gi merkostnader.

## Lokasjon og tilgjengelighet

Vi har tidligere sett at hver ressurs i Azure må knyttes til en **location**, altså en region. Valget av location handler ikke bare om hvor ressursen kjører rent praktisk, men påvirker også kostnader, ytelse og datasikkerhet.

For oss i TIHLDE er standardvalget **Norway East (Oslo)**. Azure er den eneste store skyleverandøren som faktisk har datasenter i Norge, og derfor er det også naturlig at mange norske bedrifter velger Azure fremfor konkurrentene. Ved å bruke Oslo får vi lav latency, høy oppetid og trygg lagring av data innenfor norske og europeiske rammeverk.

Man kan i prinsippet velge regioner langt unna, for eksempel i India. Der kan prisene kan være noe lavere, men gevinsten spises raskt opp av høy latency, dårligere forutsigbarhet og manglende samsvar med GDPR.

Det er først dersom man setter opp **High Availability (HA)** på tvers av regioner at flere locations blir aktuelt. Da kan man for eksempel kombinere **Norway East** og **West Europe (Amsterdam)** for å sikre drift selv om en hel region feiler. For små prosjekter og for oss i TIHLDE er dette unødvendig, og vi holder oss derfor til Oslo.

For å forstå hva “HA på tvers av regioner” egentlig innebærer, er det nyttig å vite hvordan Azure organiserer infrastruktur internt:

* En **Region** er et geografisk område (Oslo, Amsterdam).

* En **Availability Zone (AZ)** er et fysisk datasenter i en region.

* En **Fault Domain (FD)** er en fysisk gruppering som deler strøm eller rack, slik at feil ikke slår ut alt samtidig.

* En **Update Domain (UD)** er en logisk gruppering for oppdateringer og vedlikehold, som sørger for at ikke alle instanser blir restartet på samme tid.

Mange av PaaS-tjenestene i Azure har innebygd beskyttelse mot underliggende maskinvare- eller plattformfeil – for eksempel rackfeil eller oppdateringer – slik at du får en viss grad av robusthet “gratis”. Men merk at høyere nivåer av redundans som sone- (AZ) eller region-overgripende replikasjon ofte krever aktiv konfigurasjon eller valg av spesialisert tjeneste-tier.
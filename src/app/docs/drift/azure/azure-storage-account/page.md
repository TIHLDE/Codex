# Azure Storage Account

En **Storage Account** i Azure er en fleksibel lagringsløsning for ustrukturert data – alt fra filer og bilder til backups og loggfiler. For oss i TIHLDE er dette en kritisk komponent som vi bruker til flere formål, og det er viktig å forstå både mulighetene og kostnadene knyttet til lagring i skyen.

## Hva er en Storage Account?

En Storage Account fungerer omtrent som Amazons S3, og bruker til og med samme API-standard. Det betyr at verktøy og biblioteker som er laget for S3 ofte kan brukes direkte mot Azure Storage. Inne i en Storage Account kan vi ha flere typer lagring:

* **Blob Storage:** For store filer som bilder, PDFer, videoer og backups  
* **File Storage:** For fildelinger som kan mountes som nettverksdrev  
* **Queue Storage:** For meldingskøer mellom tjenester  
* **Table Storage:** For NoSQL-data (brukes sjelden i dag)

I TIHLDE bruker vi primært **Blob Storage**, som er den mest vanlige lagringstypen for objekter og filer.

## Bruksområder i TIHLDE

Vi bruker Storage Accounts til flere viktige oppgaver:

* **Terraform state-filer:** Terraform trenger å lagre tilstanden til infrastrukturen et sted sikkert og delt. En Storage Account med versjonering og låsing er perfekt for dette.  
* **Database-backups:** Automatiske backups av MySQL-databasen lagres her, slik at vi har en sikkerhetskopi dersom noe går galt.  
* **TODDEL-bladet:** PDFer av TODDEL lagres som blobs og gjøres tilgjengelige for medlemmene våre. Dette gir en enkel måte å distribuere filer på uten å måtte hoste en egen filserver.  
* **Logfiler og annen ustrukturert data:** Alt som ikke passer i en database, men som må bevares over tid.

På sikt kan Storage Accounts også brukes til **Disaster Recovery-automatisering**, der vi replikerer kritiske data til en annen region for å sikre kontinuitet ved store feil.

## Kostnader og egress

Som vi har sett tidligere, er Storage Accounts blant de rimeligste ressursene i Azure – særlig når det gjelder lagring av små til moderate datamengder. Men det er viktig å huske at **egress-kostnader** gjelder når data lastes ned fra Azure til internett.

Når medlemmer laster ned TODDEL-bladet som PDF, blir det en liten kostnad per nedlasting. Dette er sjelden et problem for små volumer, men dersom vi skulle distribuere store filer til mange brukere, kan kostnadene øke raskt. Overføringer internt i Azure, for eksempel mellom en Storage Account og en Container App i samme region, er derimot gratis.

## Access tiers – lagringslag for kostnadsoptimalisering

Azure Blob Storage tilbyr flere **access tiers** som balanserer lagringskostnader mot tilgangshastighet og hentekostnader:

* **Hot:** For data som aksesseres ofte. Høyest lagringskostnad, men lavest kostnad for lesing og skriving. Passer til filer som er i aktiv bruk.  
* **Cool:** For data som aksesseres sjeldnere, typisk mindre enn én gang per måned. Lavere lagringskostnad enn Hot, men høyere kostnader for å hente dataene. Egnet for backups som er noen måneder gamle.  
* **Cold:** For data som aksesseres svært sjelden, typisk mindre enn én gang per kvartal. Enda lavere lagringskostnad, men høyere tilgangskostnader enn Cool.  
* **Archive:** For langtidslagring av data som nesten aldri aksesseres. Ekstremt lav lagringskostnad, men det tar flere timer å "reaktivere" dataene før de kan lastes ned. Perfekt for gamle backups som må bevares for compliance, men som man aldri forventer å trenge.

Ved å flytte eldre backups fra Hot til Cool eller Archive kan vi spare betydelige kostnader over tid, uten at vi mister dataene. Dette kan automatiseres med **lifecycle policies**, slik at filer automatisk nedgraderes etter en viss tid.

## Replication og tilgjengelighet

Når vi oppretter en Storage Account, må vi velge en **replication type** som bestemmer hvordan dataene kopieres for å sikre tilgjengelighet:

* **LRS (Locally Redundant Storage):** Data kopieres tre ganger innenfor samme datasenter. Billigst, men gir ingen beskyttelse mot regionale feil.  
* **ZRS (Zone Redundant Storage):** Data kopieres på tvers av availability zones i samme region. Bedre sikkerhet enn LRS.  
* **GRS (Geo-Redundant Storage):** Data kopieres til en annen region, slik at vi har en backup selv om hele Oslo-regionen skulle feile. Dette bruker TIHLDE for produksjonsmiljøet.  
* **GZRS (Geo-Zone Redundant Storage):** Kombinerer ZRS og GRS for maksimal sikkerhet.

For produksjonsmiljøer anbefales GRS eller GZRS, mens utviklingsmiljøer kan klare seg med LRS for å spare kostnader.

## Lifecycle Management og prevent\_destroy

Som med databaser bruker vi en **lifecycle-blokk** i Terraform for å beskytte Storage Accounts mot utilsiktet sletting. Med `prevent_destroy = true` sikrer vi at Terraform ikke kan fjerne lagringsressurser som inneholder kritiske data, selv om noen gjør en feil i konfigurasjonen.
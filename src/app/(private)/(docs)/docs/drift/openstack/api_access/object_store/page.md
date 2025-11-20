_sist oppdatert: 2025-11-18 av Stian

# Object Store i Swift

## Blob storage og S3 buckets:

### Hva er Blob storage?
Blob storage, eller Binary Large OBject Store (ja, de likte nok bare navnet og fant på forkortelsen etterpå) er en type lagring som brukes til å lagre store mengder utstrukturert data. I TIHLDE brukes det primært til bilder, PDF-dokumenter og database-backups.

### Hva er S3 bucket?
Amazon (og senere hele internett) sin standard for BLOB storage og står for Simple Storage Service. Hver bucket (container i Swift) har sitt eget unike navn. Azure opererer med en `https://<prosjektnavn>.blob.core.windows.net/<container>/<objektsreferanse>`
variant for eksempel. I swift hos NTNU ser det ut som følger: 
`https://s3.region.stack.it.ntnu.no/swift/v1/<project_id>/<container>/<objektsreferanse>`.

## Object store direkte i Openstack

Når man skal sette opp så er det greit å ha kontroll på litt env greier for openstack. Dette får man ved å lage application credentials og laste ned openrc.sh fila.

```
deg@maskin:mappe % cat <applicaton_credentials>-openrc.sh¨

#!/usr/bin/env bash

export OS_AUTH_TYPE=v3applicationcredential
export OS_AUTH_URL=<auth_server>
export OS_IDENTITY_API_VERSION=3
export OS_REGION_NAME="<region>"
export OS_INTERFACE=public
export OS_APPLICATION_CREDENTIAL_ID=<ac_auth_id>
export OS_APPLICATION_CREDENTIAL_SECRET=<ac_auth_secret>

```
Hvis du er usikker på domain eller project id kan du laste ned din egen `openrc.sh` fil og sjekke her. 

```
deg@maskin:mappe % cat STUDORG_TIHLDE-Drift-openrc.sh         
#!/usr/bin/env bash

export OS_AUTH_URL=<auth_server>
export OS_PROJECT_ID=<project_id>
export OS_PROJECT_NAME="project_name"
export OS_USER_DOMAIN_NAME="<domain_name>"
export OS_USERNAME="<username>"
export OS_PASSWORD="<password>"
export OS_REGION_NAME="<region>"
export OS_INTERFACE=public
export OS_IDENTITY_API_VERSION=3%     
```

{% callout title="Viktig!" type="warning" %}
IKKE bruk dine egne credentials, da dette lager et sikkerhetshull.
{% /callout %}


### Oppsett
Object store er lett å bruke med GUI, spesielt om man setter containerene sine til Public Access, da er det bare å bruke linken til å hente ut.

i swift out of the box er linken gjerne noe som dette på NTNU sine servere i openstack 
`
https://s3.<region>.stack.it.ntnu.no/swift/v1/<project_id>/<container>/<objektsreferanse>
`

Om man vil leke direkte her kan man lage application credentials, deretter lage en token med følgende kommando:

```
curl -i -X POST <auth_server>/v3/auth/tokens \
  -H "Content-Type: application/json" \
  -d '{
    "auth": {
      "identity": {
        "methods": ["application_credential"],
        "application_credential": {
          "id": "<auth>",
          "secret": "<auth_secret>"
        }
      }
    }
  }'
  ```


Her kan man sjekket i headeren så ligger auth token som -X-Auth-Secret ellerno, kan man kopiere og deretter bruke den til å kjøre følgende kommando:

```
curl -i -X curl -i -X PUT \
  -H "X-Auth-Token: <auth_token>" \
  -T ./<objektsreferanse> \
  https://s3.<region>.stack.it.ntnu.no/swift/v1/<project_id>/<container>/<objektsreferanse>
```

Da legger man inn objektet man refererer til i containeren man viser til med objektsreferansen som navn, dette er selvfølgelig ikke den ryddigste måten, men det gir et innblikk i hvordan ting fungerer.


### TIHLDEs oppsett
I TIHLDE må all data i blob storage være tilgjengelig og strukturert for en database. Dette er satt opp til å være S3 compliant og automatisert, index gjør det meste i sin backend og de trenger bare en bruker (Application credential) og link til backup bucketen sin.

Greit å sette opp en dns-record her så rutingen kan gå smud `s3.tihlde.org/<container>/<objeksreferanse>` som viser til `drift.tihlde.org`

for eksempel. Deretter kan man rute det dit det skal fra innsiden serverparken til ntnu.

### Sikkerhetskopiering og backup

Sikkerhetskopiering og backups gjøres med rclone og backup av endringer tas hvert TIDSROM minutt og hele datamengden tas hvert TIDSROM minutt.

#### Rclone config
Configen i rclone ser ut som følger:


```
[azure]
type = azureblob
account = <azure_container>
key = <azure_auth_secret>

[swift]
type = swift
env_auth = false
auth_version = 3
auth = <auth_server>/v3
user =
key =
application_credential_id = <ac_auth_id>
application_credential_secret = <ac_auth_secret>
tenant = <openstack_project>
region = <openstack_region>
endpoint_type = public
```

#### rclone automatiseringsscript
fyll ut
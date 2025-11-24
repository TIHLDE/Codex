_sist oppdatert: 2025-11-17 av Stian_

# Bruke Openstack via API

Openstack er et veldig kraftig verktøy som fort kan bli underutnyttet hvis man ikke bruker det på den tiltenkte måten. Den tiltenkte måten er selvfølgelig med API tilgang, og API-adressene ligger inne på [stack.it.ntnu.no](https://stack.it.ntnu.no/horizon/project/api_access/).

### Hvilke API endepunkter gjør hva?

- Block Storage - Lagring av data som skal være rask og aksesserbar.
- Cloudformation - idk, vi bruker det ikke
- Compute - idk, vi bruker det ikke
- Container infra - ligger ikke inn på openstack engang
- Dns - dns
- Identity - Auth for alt som skjer på openstack
- Image - idk, bruker det ikke
- Key Manager - idk, bruker det ikke
- Load Balancer - idk, bruker det ikke
- Network - idk, bruker det ikke
- Object store - blob storage, viktig for store filer og bilder
- Orchestration - Container orchestration
- Placement - idk
- Volumev3 - Masselagring

Som dere ser vet vi ikke nok om dette. Det viktigste er egentlig å benytte API der det er mulig å legge inn dokumentasjon, så vi ser hvordan ting settes opp med API. Dersom man skal bytte fra Openstack på et tidspunkt, eller skal johbe med AWS eller Azure etter sin tid i drift er det veldig smart å kunne operere med API kall i stedet for å måtte gjøre alt i Linux CLI.
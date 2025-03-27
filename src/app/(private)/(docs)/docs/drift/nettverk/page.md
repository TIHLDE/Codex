---
title: Nettverk
---
## Hva gjør port forwarding?

Port forwarding er omtrent det det høres ut som.
Man bestemmer at alt man får inn på en port videresendes.

### Hva har jeg gjort?

I mitt tilfelle er det satt opp på port 3306 som er mysql sin default port, men 
det har ikke så mye å si hvilken port man velger.



## Hvordan benytte port forwarding i debian:

```
#!/bin/bash

sudo sysctl -w net.ipv4.ip_forward=1

######################################
#     Kopier og legg inn ønsket      #
# port \<PORT\> og ip \<IP-ADDRESS\> #
######################################

## Add nat postrouting rule
#sudo iptables -t nat -A POSTROUTING -p tcp --dport <PORT> -d <IP-ADRESS> -j MASQUERADE
#
#
## Add nat prerouting rule
#sudo iptables -t nat -A PREROUTING -p tcp --dport <PORT> -j DNAT --to-destination <IP-ADRESS>:<PORT>


# Add nat postrouting rule for port 3306 on ip 10.212.25.177
sudo iptables -t nat -A POSTROUTING -p tcp --dport 3306 -d 10.212.25.177 -j MASQUERADE


# Add nat prerouting rule for port 3306 on ip 10.212.25.177
sudo iptables -t nat -A PREROUTING -p tcp --dport 3306 -j DNAT --to-destination 10.212.25.177:3306
```


## Forklaring
De forskjellige tingene betyr noe, tro det eller ei.

### Postrouting
Postrouting brukes for å endre pakker som forlater systemet, altså alt som skal sendes ut.

Regele sier:

"For utgående TCP-trafikk mot \<IP-ADRESS\> på port \<PORT\>, masquerade (endre) avsenderens IP til å være den eksterne IP-en til maskinen som kjører iptables."

### Flaggene

*-t nat*: bestemmer at regelen gjelder NAT og brukes til å endre ip adresse på pakken.

*-A POSTROUTING*: Legger til(-A Append) en regel som brukes etter routing, altså før pakken forlater systemet.

*-p tcp*: bestemmer protokoll, her tcp.

*--dport \<PORT\>*: Regelen gjelder kun for trafikk som går til valgt port.

*-d \<IP-ADRESS\>*: Regelen gjelder kun for trafikk som går til en spesifikk ip adresse.

*-j MASQUERADE*: Handlingen er -j jump, og parameteret MASQUERADE er avgjørende for at utgående pakker får sin source-IP erstattet med systemets eksterne ip adresse.

### Prerouting
Prerouting brukes for å endre pakker før de kommer inn på systemet.

*-t nat*: bestemmer at regelen gjelder NAT og brukes til å endre ip adresse på pakken.

*-A PREROUTING*: Legger inn (-A Append) en regel som brukes før routing, og som avgjør hvor pakken skal sendes.

*-p tcp*: bestemmer protokoll, her tcp.

*--dport \<PORT\>*: Regelen gjelder kun for trafikk som kommer inn på valgt port.

*-d \<IP-ADRESS\>*: Regelen gjelder kun for trafikk som kommer inn på valgt ip adresse.

*-j DNAT*: Handlingen er -j jump, og parameteret DNAT(Destination NAT) som innebærer at destinasjons-IP-adressen til pakken blir endret.


## Hvordan benytte det som er satt opp?
Kjør
```
debian@network: sudo nano usr/local/bin/forwardmysql
```

Bytt ut \<PORT\> og \<IP-ADDRESS\> med opphav og destinasjon.


Merk, dette gjelder for det som er satt opp per 27.03.2025.

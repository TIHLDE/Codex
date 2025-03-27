---
title: Nettverk
---
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

Kjør
```
debian@network: sudo nano usr/local/bin/forwardmysql
```

Bytt ut \<PORT\> og \<IP-ADDRESS\> med opphav og destinasjon


Merk, dette gjelder for det som er satt opp per 27.03.2025

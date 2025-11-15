+++
title = "Network routing naar LAN systemen met OpenVPN Server"
description = "Om het systeem in het LAN netwerk gedetecteerd te kunnen laten worden moet je een route toevoegen"
author = "van den Boom"
date = 2025-11-15T15:40:22+01:00
tags = ["Network", "routing", "LAN", "systemen", "OpenVPN", "Server"]
categories = ["windows", "linux", "macos", "tools", "utilities", "routing"]
+++

Om systemen op het LAN-netwerk te kunnen benaderen via de VPN-tunnel van de OpenVPN-server, moet het LAN-systeem weten dat verkeer bestemd voor het VPN-subnet via de OpenVPN-server moet worden verstuurd. Zonder deze extra route komt retourverkeer niet bij de VPN-clients terecht.

In dit voorbeeld gebruiken we het subnet 10.0.8.0/24 als de IP-range die je hebt ingesteld voor de OpenVPN-tunnel. Dit is het netwerk waarin alle VPN-clients een IP-adres krijgen. Om ervoor te zorgen dat een apparaat op het LAN verkeer correct kan terugsturen naar deze VPN-clients, moet je op dat LAN-apparaat een statische route toevoegen.

Voorbeeld (Windows):

`route add 10.0.8.0 MASK 255.255.255.0 <IP-van-de-OpenVPN-server>`


Vervang <IP-van-de-OpenVPN-server> door het LAN-adres van de OpenVPN-server (bijvoorbeeld 192.168.1.10).

Soms is het bovendien nodig om expliciet de netwerkinterface op te geven waarlangs deze route moet lopen. Dit kan nodig zijn wanneer het systeem meerdere netwerkadapters heeft, of wanneer Windows niet automatisch de juiste interface kiest. In dat geval voeg je het interface-nummer toe dat correspondeert met de LAN-poort waarop de OpenVPN-server is aangesloten:

`route add 10.0.8.0 MASK 255.255.255.0 <IP-van-de-OpenVPN-server> IF <interface-ID>`


Het interface-ID kun je opvragen via:

`route print`

Om de route te verwijderen

`route delete 10.0.8.0`


Na het toevoegen van deze (eventueel interface-specifieke) route weet het LAN-systeem dat al het verkeer naar het tunnelnetwerk 10.0.8.0/24 via de OpenVPN-server moet worden gestuurd, zodat VPN-clients correct bereikbaar zijn.
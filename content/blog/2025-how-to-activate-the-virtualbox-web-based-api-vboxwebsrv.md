---
title: De webgebaseerde VirtualBox-API activeren - VBoxWebSrv
date: 2025-07-01T08:30:05.765Z
draft: false
categories:
  - article
tags:
  - VirtualBox
  - web-based
  - API
  - VBoxWebSrv
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
**VBoxWebSrv** is de VirtualBox-webservice waarmee u uw VirtualBox-virtuele machines op afstand kunt beheren via een webgebaseerde API. Het wordt vaak gebruikt met tools zoals **phpVirtualBox** om een volledige webinterface te bieden voor VM-beheer.

Door VBoxWebSrv als Windows-service uit te voeren, zorgt u ervoor dat het automatisch start met uw systeem en continu op de achtergrond draait.

VBoxWebSrv installeren als Windows-service met NSSM

1. Download NSSM (Non-Sucking Service Manager) van https://nssm.cc/download en pak het uit.
2. Open de opdrachtprompt als beheerder en voer uit:

   ```
   C:\nssm\win64\nssm.exe install VBoxWebSrv
   ```
3. In de NSSM-GUI:

   Stel Pad in op
   C:\Progra~1\Oracle\VirtualBox\VBoxWebSrv.exe

   Stel de opstartmap in op
   C:\Progra~1\Oracle\VirtualBox

   Voeg argumenten toe \
   -H 0.0.0.0 -p 18083
4. Klik op Install service
5. Start de service met:

   ```
   C:\nssm\win64\net start VBoxWebSrv
   ```
6. O﻿pen poort 18083 in de Windows Firewall
7. T﻿est of de service beschikbaar is

   ```
   C:\nssm\win64\netstat -an | findstr 18083

   C:\nssm\win64\curl http://localhost:18083/

   C:\nssm\win64\telnet localhost 18083
   ```

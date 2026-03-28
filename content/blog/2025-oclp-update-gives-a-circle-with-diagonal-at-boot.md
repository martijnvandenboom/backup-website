---
title: OCLP-update geeft een cirkel met diagonaal bij het opstarten
date: 2025-04-04T14:27:55.743Z
draft: false
categories:
  - article
tags:
  - OCLP
  - update
  - circle
  - diagonal
  - boot
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
Welke Mac gebruikt u?\
iMac (Retina 5K, 27 inch, Late 2015)\
Model-ID: iMac17,1\
\
Welke versie van OCLP gebruikt u?\
2.3.1\
\
Welke OS-versie heeft u geïnstalleerd of probeert u te installeren?\
Geïnstalleerd: Sequoia 15.3.2 (24D81)\
\
Wat is precies het probleem dat u ondervindt?\
Na het installeren van OCLP 2.3.1 op schijf weigert mijn iMac op te starten. Bij het opstarten druk ik op de Option-toets om het menu te openen, ik kies het blauwe OCLP-icoon. Normaal gesproken gaat het daarna verder met het Apple-logo, maar nu verschijnt er een cirkel met een diagonaal.\
Gelukkig kon ik met mijn oude USB-stick met OCLP 2.2.0 opstarten vanaf USB. Dat werkte prima. Vervolgens heb ik mijn EFI-partitie gekoppeld, de OC-map verwijderd en vervangen door die van mijn USB-stick. Nu start mijn iMac weer op, maar met versie 2.2.0.\
Gebruik het hulpmiddel: MountEFI Beschikbaar op GitHub: [https://github.com/corpnewt/MountEFI](https://github.com/corpnewt/MountEFI "https\://github.com/corpnewt/MountEFI")\
\
N﻿u heb ik het kunnen oplossen met de volgende instellingen in OCLP:\
Mijn iMac is een Late 2015 27" met modelnummer 17,1</br>\
In het OCLP-hulpprogramma bij instellingen heb ik ingevuld:</br>
Doelmodel: 17,1</br>
Build: Debug: Vink alle 3 opties aan: Verbose, Kext Debugging en OpenCore Debugging</br>
Extra's: Vink aan: 3rd Party NVMe PM</br>
Beveiliging: Vink alle opties aan onder SIP</br>
SMBIOS: SMBIOS Spoof Level: Matig en SMBIOS Spoof Model: iMac19,1</br>
Vervolgens heb ik OpenCore gebouwd en geïnstalleerd op schijf</br>\
\
Trouwens, in de tussentijd was OCLP bijgewerkt naar versie 2.3.2 en heb ik deze versie gebruikt.</br>

\
H﻿erstart.</br>\
En voilà, het werkt!

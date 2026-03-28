---
title: Bestanden delen met MS-DOS 6.22 in VirtualBox en macOS
date: 2023-09-17T12:29:24.472Z
draft: false
categories:
  - article
tags:
  - sharing
  - files
  - MS-DOS
  - VirtualBox
  - macOS
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
Hoe maak je een ISO-bestand van een map op macOS dat als CDROM gekoppeld kan worden in MS-DOS 6.22?

Start Schijfhulpprogramma op macOS

1. Ga naar: Archief -> Nieuwe afbeelding -> Afbeelding van map
2. Kies de map en druk op Kies
3. Stel Afbeeldingsformaat in op: DVD/CD-master en druk op Bewaar
4. Er wordt een *.cdr-bestand aangemaakt
5. Ga naar de opdrachtregel
6. Navigeer naar de map met het *.cdr-bestand
7. Typ het commando: $ hdiutil makehybrid -iso -joliet -o tcc.iso TCC.cdr
8. Ga naar je virtuele machine met MS-DOS 6.22 en koppel het nieuw aangemaakte *.iso-bestand
9. In de MS-DOS 6.22 virtuele machine heb je nu toegang tot de inhoud op station D:

</br>

Vragen?

Laat het me weten!

Neem contact met me op via mijn sociale media-links.

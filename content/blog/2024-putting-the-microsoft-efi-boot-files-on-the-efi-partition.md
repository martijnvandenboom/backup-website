---
title: De Microsoft EFI-opstartbestanden op de EFI-partitie plaatsen
date: 2024-07-07T20:49:33.290Z
draft: false
categories:
  - article
tags:
  - putting
  - microsoft
  - efi
  - boot
  - files
  - partition
  - triple
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
Start op via het Windows-installatieprogramma

Druk op het eerste scherm op SHIFT + F10

```

# diskpart
# list disk
# select disk 0
# list part
Zoek naar de Windows-partitie

# select part 3
# assign letter=W
# format quick fs=NTFS
# list volume
Zoek naar het EFI-volume

# select volume 2
# assign letter=Z
# exit

# D:
Ga naar de USB-installatieschijf van Windows
# cd D:\sources
# dir install*
Het bestand install.esd bestaat

# dism /Get-WimInfo /WimFile:D:\Sources\install.esd
Selecteer de Index van de gewenste Windows-versie

# dism /Apply-image /ImageFile:D:\Sources\install.esd /index:6 /ApplyDir:W:\
# bcdboot W:\Windows /l en-us /s Z: /f UEFI
Zet uw computer uit en verwijder de USB-installatieschijf
Nu hebben we de Microsoft EFI-opstartbestanden op de EFI-partitie in de daarvoor bestemde map

```

Volg de normale procedure voor het installeren van Windows

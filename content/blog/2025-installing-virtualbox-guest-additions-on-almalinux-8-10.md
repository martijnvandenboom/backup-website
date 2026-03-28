---
title: VirtualBox Guest Additions installeren op AlmaLinux 8.10
date: 2025-03-29T20:16:41.155Z
draft: false
categories:
  - article
tags:
  - install
  - virtualbox
  - guest
  - additions
  - almalinux
  - "8.10"
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
> $ sudo dnf update\
> $ sudo reboot\
> (Zodat een nieuw geïnstalleerde kernel wordt geladen)\
> \
> $ sudo dnf install gcc kernel-devel kernel-headers make bzip2 perl\
> \
> Ga naar het VirtualBox-menu > Apparaten > Guest Additions-cd-image invoegen\
> \
> Automatisch:\
> Klik op Uitvoeren\
> \
> Handmatig:\
> $ cd /run/media/$USER/VBox\_GAs\_*/   # Pas het pad aan indien nodig\
> $ sudo ./VBoxLinuxAdditions.run\
> \
> $ sudo reboot\
> \
> Verificatie:\
> $ lsmod | grep vbox\
> (Controleer of vboxguest wordt vermeld)

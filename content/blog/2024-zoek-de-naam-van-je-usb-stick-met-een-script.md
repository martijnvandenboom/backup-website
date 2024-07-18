---
title: Zoek de naam van je USB stick met een script
date: 2024-07-18T07:20:59.657Z
draft: false
categories:
  - article
tags:
  - zoek
  - naam
  - usb
  - stick
  - bash
  - script
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
D﻿it script kun je gebruiken voor het opvragen van de naam van je USB stick.\
De naam van je USB stick kun je gebruiken in het sudo commando van Apple om een USB installer te maken.\
\
S﻿tap 1: Open de Terminal applicatie\
S﻿tap 2: type: sudo echo\
S﻿tap 3: type je wachtwoord\
S﻿tap 4: kopieer onderstaande tekst en plak die in de Terminal applicatie en druk op Enter

```
externe_disks=$(sudo diskutil list | grep external | awk '{print $1}')

if [[ "$externe_disks" ]]; then
  echo ""
  echo "==="
  echo "Externe USB volumes:"
  for disk in $externe_disks; do
    #echo "$disk"
    sudo mount | grep $disk | awk -F' ' '$3 ~ "/Volumes/" {print $3, $4, $5, $6, $7, $8, $9, $10}' | awk -F'(' '{print $1}' | sed 's/^ *//; s/ *$//' | sed 's/ /\\ /g'
  done
  echo ""
else
  echo ""
  echo "Er zijn geen externe USB sticks aangesloten!"
  echo ""
fi

```



S﻿tap 5: onder de 3 === tekens staat nu de naam van je USB stick\
S﻿tap 6: de naam van het volume kun je nu vervangen in het sudo commando van Apple
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
S﻿tap 2: Ga naar je home directory, type: # cd\
S﻿tap 3: Maak eventueel een directory scripts, type: # mkdir scripts\
S﻿tap 4: Ga naar de zojuist gemaakte scripts directory, type: # cd scripts\
Stap 5: Maak een bash script, type: # vim usbstick.sh\
Stap 6: Insert de volgende code: 

```
#!/bin/bash

# Get list of all external physical disks
external_disks=$(diskutil list external physical | grep '^/dev/' | awk '{print $1}')

# Check if any were found
if [[ -z "$external_disks" ]]; then
  echo ""
  echo "Er zijn geen externe USB sticks aangesloten!"
  echo ""
  exit 0
fi

echo ""
echo "==="
echo "Externe USB volumes:"

# Loop through each disk
for disk in $external_disks; do
  # Get all partitions for the disk
  partitions=$(diskutil list "$disk" | grep '^   [0-9]' | awk '{print $NF}')
  for part in $partitions; do
    # Get mount info
    mount_point=$(diskutil info "$part" | awk -F: '/Mount Point/ {gsub(/^ +| +$/, "", $2); print $2}')
    volume_name=$(diskutil info "$part" | awk -F: '/Volume Name/ {gsub(/^ +| +$/, "", $2); print $2}')
    fs_type=$(diskutil info "$part" | awk -F: '/Type \(Bundle\)/ {gsub(/^ +| +$/, "", $2); print $2}')
    
    # Only show if it's mounted
    if [[ -n "$mount_point" && "$mount_point" != "Not mounted" ]]; then
      echo "• Volume: $volume_name"
      echo "  Mount point: $mount_point"
      echo "  File system: $fs_type"
      echo ""
    fi
  done
done

```

\
S﻿tap 7: Maak het script executable, type: # chmod +x usbstick.sh\
S﻿tap 8: Voer het script uit, type: # ./usbstick.sh\
S﻿tap 9: Onder de 3 === tekens staat nu de naam van je USB stick\
S﻿tap 10: De naam van het volume kun je nu vervangen in het sudo commando van Apple

O﻿F

S﻿tap 1: Open de Terminal applicatie\
S﻿tap 2: Copy and paste het hele code block in de terminal

```
bash <<'EOF'
# your entire script goes here
external_disks=$(diskutil list external physical | grep '^/dev/' | awk '{print $1}')

if [[ -z "$external_disks" ]]; then
  echo ""
  echo "Er zijn geen externe USB sticks aangesloten!"
  echo ""
  exit 0
fi

echo ""
echo "==="
echo "Externe USB volumes:"

for disk in $external_disks; do
  partitions=$(diskutil list "$disk" | grep '^   [0-9]' | awk '{print $NF}')
  for part in $partitions; do
    mount_point=$(diskutil info "$part" | awk -F: '/Mount Point/ {gsub(/^ +| +$/, "", $2); print $2}')
    volume_name=$(diskutil info "$part" | awk -F: '/Volume Name/ {gsub(/^ +| +$/, "", $2); print $2}')
    fs_type=$(diskutil info "$part" | awk -F: '/Type \(Bundle\)/ {gsub(/^ +| +$/, "", $2); print $2}')
    
    if [[ -n "$mount_point" && "$mount_point" != "Not mounted" ]]; then
      echo "• Volume: $volume_name"
      echo "  Mount point: $mount_point"
      echo "  File system: $fs_type"
      echo ""
    fi
  done
done
EOF
```

S﻿tap 3: Druk op: Enter
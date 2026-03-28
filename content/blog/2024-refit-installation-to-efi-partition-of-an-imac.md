---
title: rEFIt installeren op de EFI-partitie van een iMac
date: 2024-06-27T22:27:46.468Z
draft: false
categories:
  - article
tags:
  - refit
  - installation
  - efi
  - partition
  - sip
  - disable
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
V﻿olg de onderstaande stappen om rEFIt te installeren op de EFI-partitie van een iMac

D﻿ownload rEFIt en kopieer de efi-map naar de /efi-map zoals hieronder uitgelegd\
\
V﻿oordat u het bless-commando uitvoert, schakelt u de SIP uit\
Start op in herstelmodus\
#﻿ csrutil status\
#﻿ csrutil disable\
#﻿ reboot

```
sudo mkdir /efi

sudo mount -t msdos /dev/disk0s1 /efi

sudo bless --mount /efi --setBoot --file /efi/EFI/refit/refit.efi --labelfile /efi/EFI/refit/refit.vollabel
```

---
title: rEFIt installation to EFI partition of an iMac
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
F﻿ollow the steps below to install rEFIt to the EFI partition of an iMac

D﻿ownload rEFIt and copy the efi folder to the /efi folder as explained below\
\
B﻿efore you do the bless command disable the SIP\
Boot in recovery mode\
#﻿ csrutil status\
#﻿ csrutil disable\
#﻿ reboot

```
sudo mkdir /efi

sudo mount -t msdos /dev/disk0s1 /efi

sudo bless --mount /efi --setBoot --file /efi/EFI/refit/refit.efi --labelfile /efi/EFI/refit/refit.vollabel
```
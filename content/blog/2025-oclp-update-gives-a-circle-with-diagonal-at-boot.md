---
title: OCLP update gives a circle with diagonal at boot
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
What Mac are you using?\
iMac (Retina 5K, 27-inch, Late 2015)\
Model Identifiers: iMac17,1\
\
What version of OCLP are you using?\
2.3.1\
\
What OS version do you have installed or are trying to install?\
Installed: Sequoia 15.3.2 (24D81)\
\
What exactly is the problem you are facing?\
After installing OCLP 2.3.1 to disk my iMac refuses to boot. At boot I press the Option key to get the menu I choose the blue OCLP icon. Normally it proceeds with the apple logo but now it shows a circle with a diagonal. \
Luckily with my old USB stick that has OCLP 2.2.0 I booted of my USB. That worked fine. Then I mounted my EFI removed the OC folder and replaced it with the one from my USB stick. So now my iMac boots again but with 2.2.0\
Use the tool: MountEFI Available on GitHub: [https://github.com/corpnewt/MountEFI](https://github.com/corpnewt/MountEFI "https\://github.com/corpnewt/MountEFI")\
\
N﻿ow I have been able to fix it with the following settings in OCLP:\
My iMac is a late 2015 27" with Model nr 17,1\
In the OCLP utility in settings I put:
Target Model: 17,1
Build: Debug: Check all 3 options: Verbose, Kext Debugging and OpenCore Debugging
Extra's: Check: 3rd Party NVMe PM
Security: Check all the options under SIP
SMBIOS: SMBIOS Spoof Level: Moderate and SMBIOS Spoof Model: iMac19,1
Then I Build and Install OpenCore to disk

By the way in the mean time OCLP was updated to 2.3.2 and I used this version.\
\
R﻿eboot.\
And voila it works!
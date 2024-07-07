---
title: Putting the Microsoft EFI boot files on the EFI partition
date: 2024-07-07T20:49:33.290Z
draft: true
categories:
  - article
tags:
  - putting
  - microsoft
  - efi
  - boot
  - files
  - partition
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
Boot into the Windows installer

On the first screen press SHIFT + F10

```

# diskpart
# list disk
# select disk 0
# list part
Look for the Windows partition

# select part 3
# assign letter=W
# format quick fs=NTFS
# list volume
Look for the EFI volume

# select volume 2
# assign letter=Z
# exit

# D:
Goto the USB installer of Windows
# cd D:\sources
# dir install*
The file install.esd exists

# dism /Get-WimInfo /WimFile:D:\Sources\install.esd
Select the Index of the version of Windows you want

# dism /Apply-image /ImageFile:D:\Sources\install.esd /index:6 /ApplyDir:W:\
# bcdboot W:\Windows /l en-us /s Z: /f UEFI
Shutdown your computer and remove the USB installer
Now we have the Microsoft EFI boot files in the EFI partition in its designated folder

```

Follow the normal procedure of installing Windows
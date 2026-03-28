---
title: Create a USB rEFIt boot disk
date: 2024-07-07T20:45:53.867Z
draft: false
categories:
  - article
tags:
  - create
  - usb
  - refit
  - boot
  - disk
  - triple
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---


```
# hdiutil convert /path/to/refit-0.14.cdr -format UDRW -o /path/to/refit-0.14.img
# diskutil list
# diskutil unmountDisk /dev/disk2
# sudo dd if=/path/to/refit-0.14.img.dmg of=/dev/rdisk2 bs=1m
Using rdisk2 here seems to speed up things

# diskutil eject /dev/disk2
```
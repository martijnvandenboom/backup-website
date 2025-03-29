---
title: Installing VirtualBox Guest Additions on AlmaLinux 8.10
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
> (So any new installed kernel will be loaded)\
> \
> $ sudo dnf install gcc kernel-devel kernel-headers make bzip2 perl\
> \
> Go to the VirtualBox Menu > Devices > Insert Guest Additions CD image\
> \
> Automated:\
> Press Run\
> \
> Manual:\
> $ cd /run/media/$USER/VBox\_GAs\_*/   # Adjust path if needed\
> $ sudo ./VBoxLinuxAdditions.run\
> \
> $ sudo reboot\
> \
> Verification:\
> $ lsmod | grep vbox\
> (Check to see if vboxguest is listed)
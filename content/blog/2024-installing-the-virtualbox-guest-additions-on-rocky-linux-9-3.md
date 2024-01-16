---
title: "**Installing the VirtualBox Guest Additions on Rocky Linux 9.3**"
date: 2024-01-16T21:08:26.966Z
draft: false
categories:
  - article
tags:
  - installing
  - virtualbox
  - guest
  - additions
  - rocky
  - linux
  - "9.3"
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
**Installing the VirtualBox Guest Additions on Rocky Linux 9.3**

```
dnf install epel-release
dnf update --refresh
dnf update kernel-*
reboot (optional)

dnf install dkms kernel-devel kernel-headers gcc make bzip2 perl elfutils-libelf-devel

rpm -q kernel-devel
uname -r

Top menu: Devices -> Insert Guest Additions CD-Image
Run

(optional)
cd /run/media/
./VBoxLinuxAdditions.run
```
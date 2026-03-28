---
title: Sharing files with MS-DOS 6.22 in VirtualBox and macOS
date: 2023-09-17T12:29:24.472Z
draft: false
categories:
  - article
tags:
  - sharing
  - files
  - MS-DOS
  - VirtualBox
  - macOS
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
How to create an ISO file of a directory on macOS that can be mounted as a CDROM in MS-DOS 6.22 ?

Start Disk Utility on macOS

1. Go to: File -> New Image -> Image from Folder
2. Choose the directory and press Choose
3. Set Image Format to: DVD/CD master and press Save
4. A *.cdr file will be created
5. Go to the command line
6. Cd to the directory with the *.cdr file
7. Type the command: $ hdiutil makehybrid -iso -joliet -o tcc.iso TCC.cdr
8. Go to your virtual machine running MS-DOS 6.22 and mount the newly created *.iso file
9. In the MS-DOS 6.22 virtual machine you can now access the contents on drive D: 

</br>

Any questions?

Let me know!

Contact me on my Social Media links.
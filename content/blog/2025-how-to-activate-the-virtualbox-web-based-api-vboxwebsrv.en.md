---
title: How to activate the VirtualBox web-based API - VBoxWebSrv
date: 2025-07-01T08:30:05.765Z
draft: false
categories:
  - article
tags:
  - VirtualBox
  - web-based
  - API
  - VBoxWebSrv
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
**VBoxWebSrv** is the VirtualBox Web Service that allows you to manage your VirtualBox virtual machines remotely through a web-based API. It is commonly used with tools like **phpVirtualBox** to provide a full web interface for VM control.

By running VBoxWebSrv as a Windows service, you ensure it starts automatically with your system and runs continuously in the background.

Installing VBoxWebSrv as a Windows Service with NSSM

1. Download NSSM (Non-Sucking Service Manager) from https://nssm.cc/download and extract it.
2. Open Command Prompt as Administrator and run:

   ```
   C:\nssm\win64\nssm.exe install VBoxWebSrv
   ```
3. In the NSSM GUI:

   Set Path to
   C:\Progra~1\Oracle\VirtualBox\VBoxWebSrv.exe

   Set Startup directory to
   C:\Progra~1\Oracle\VirtualBox

   Add arguments \
   -H 0.0.0.0 -p 18083 
4. Click Install service
5. Start the service with:

   ```
   C:\nssm\win64\net start VBoxWebSrv
   ```
6. O﻿pen the port 18083 in the Windows Firewall
7. T﻿est if the service is available

   ```
   C:\nssm\win64\netstat -an | findstr 18083

   C:\nssm\win64\curl http://localhost:18083/

   C:\nssm\win64\telnet localhost 18083
   ```
---
title: Microsoft Visual Studio Code installeren in Linux vanuit de repository
date: 2025-03-22T22:13:54.381Z
draft: false
categories:
  - article
tags:
  - install
  - microsoft
  - visual studio
  - code
  - linux
  - repo
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
V﻿olg de onderstaande stappen om Microsoft Visual Studio Code IDE op Linux te installeren vanuit de repository:

> sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
>
> sudo sh -c 'echo -e "\[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
>
> sudo dnf install code -y

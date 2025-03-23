---
title: Installing Oracle VirtualBox on Ubuntu Linux
date: 2025-03-23T13:20:53.400Z
draft: false
categories:
  - article
tags:
  - installing
  - Oracle
  - VirtualBox
  - Ubuntu
  - Linux
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
T﻿ry the following steps:

> $﻿ sudo apt update\
> $﻿ sudo apt upgrade\
> $﻿ sudo apt install curl\
> $﻿ curl -fsSL https://www.virtualbox.org/download/oracle_vbox_2016.asc | sudo gpg --dearmor -o /usr/share/keyrings/virtualbox-archive-keyring.gpg\
> $﻿ echo "deb \[arch=amd64 signed-by=/usr/share/keyrings/virtualbox-archive-keyring.gpg] http://download.virtualbox.org/virtualbox/debian noble contrib" | sudo tee /etc/apt/sources.list.d/virtualbox.list\
> $﻿ sudo apt update\
> $﻿ sudo search virtualbox
>
> virtualbox/noble-updates 7.0.16-dfsg-2ubuntu1.1 amd64
>   x86 virtualization solution - base binaries
>
> virtualbox-7.0/unknown 7.0.24-167081\~Ubuntu\~noble amd64
>   Oracle VM VirtualBox
>
> virtualbox-7.1/unknown 7.1.6-167084\~Ubuntu\~noble amd64
>   Oracle VirtualBox
>
> $﻿ sudo install virtualbox-7.1
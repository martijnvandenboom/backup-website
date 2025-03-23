---
title: Tips for using XRDP on Ubuntu Linux
date: 2025-03-23T12:51:59.295Z
draft: false
categories:
  - article
tags:
  - tips
  - xrdp
  - ubuntu
  - linux
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
T﻿o be able to use XRDP on Ubuntu Linux try the following instructions:

> $ s﻿udo apt update \
> $ s﻿udo apt upgrade\
> $ s﻿udo apt install xrdp\
> $ echo "gnome-session --session=ubuntu" > ~/.xsession\
> $ echo "xhost +" > ~/.bash_profile\
> $﻿ ip a

R﻿emember write down your IP address of your system and to log out of your graphical user session.

N﻿ow try to login to your system with a RDP tool.
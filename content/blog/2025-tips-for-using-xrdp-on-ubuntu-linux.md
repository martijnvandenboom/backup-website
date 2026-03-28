---
title: Tips voor het gebruik van XRDP op Ubuntu Linux
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
O﻿m XRDP op Ubuntu Linux te kunnen gebruiken, volgt u de onderstaande instructies:

> $ s﻿udo apt update \
> $ s﻿udo apt upgrade\
> $ s﻿udo apt install xrdp\
> $ echo "gnome-session --session=ubuntu" > ~/.xsession\
> $ echo "export DISPLAY=:10.0" > ~/.bash_profile\
> $ echo "xhost +" > ~/.bash_profile\
> $﻿ ip a

O﻿nthoud dat u uw IP-adres noteert en uitlogt uit uw grafische gebruikerssessie.

P﻿robeer nu in te loggen op uw systeem met een RDP-tool.

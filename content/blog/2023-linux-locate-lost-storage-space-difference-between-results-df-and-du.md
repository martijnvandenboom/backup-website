---
title: Linux zoek verloren opslagruimte op door het verschil tussen df en du te achterhalen
date: 2023-09-05T06:18:17.459Z
draft: false
categories:
  - article
tags:
  - linux
  - locate
  - lost
  - storage
  - space
  - difference
  - df
  - du
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
$ lsof | grep -E '^COM|deleted'

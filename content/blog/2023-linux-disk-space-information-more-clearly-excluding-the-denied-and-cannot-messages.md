---
title: Linux schijfruimte-informatie overzichtelijker weergeven zonder de geweigerd- en kan-niet-berichten
date: 2023-09-05T06:23:38.580Z
draft: false
categories:
  - article
tags:
  - linux
  - disk
  - space
  - information
  - clearly
  - excluding
  - denied
  - cannot
  - messages
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
$ du -hs * 2> >(egrep -iv 'permission denied|cannot access') | sort -n

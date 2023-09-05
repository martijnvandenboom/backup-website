---
title: Linux disk space information more clearly excluding the denied and cannot
  messages
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
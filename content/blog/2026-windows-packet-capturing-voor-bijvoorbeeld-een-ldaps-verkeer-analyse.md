---
title: Windows packet capturing voor bijvoorbeeld een LDAPS verkeer analyse
date: 2026-01-18T18:55:54.439Z
draft: false
categories:
  - article
tags:
  - windows
  - packet
  - capturing
  - LDAPS
  - analyse
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
Open een Windows Terminal of Command sessie As Administrator

```
Check existing filters
# pktmon filter list

Clear all filters
# pktmon filter remove

Check capture status*
# pktmon status

Add a filter for LDAPS
# pktmon filter add -p 636

Start the capture
# pktmon start --etw
```

Probeer opnieuw verbinding te maken met de LDAP server / Indien je een andere poort wilt monitoren herhaal dan het commando dat het netwerkverkeer genereert.

```
Stop the capture
# pktmon stop

Converteer naar een tekst bestand
# pktmon format PktMon.etl > PktMon.txt
```

Analyseer / Upload de tekst file met een AI tool.
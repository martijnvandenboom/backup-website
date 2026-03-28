---
title: Windows packet capturing for example for an LDAPS traffic analysis
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
Open a Windows Terminal or Command session As Administrator

```
Check existing filters
# pktmon filter list

Clear all filters
# pktmon filter remove

Check capture status
# pktmon status

Add a filter for LDAPS
# pktmon filter add -p 636

Start the capture
# pktmon start --etw
```

Try to connect again to the LDAP server / If you want to monitor a different port, repeat the command that generates the network traffic.

```
Stop the capture
# pktmon stop

Convert to a text file
# pktmon format PktMon.etl > PktMon.txt
```

Analyse / Upload the text file with an AI tool.

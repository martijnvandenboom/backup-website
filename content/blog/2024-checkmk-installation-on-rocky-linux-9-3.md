---
title: Checkmk installatie op Rocky Linux 9.3
date: 2024-01-16T21:13:15.512Z
draft: false
categories:
  - article
tags:
  - checkmk
  - installation
  - rocky
  - linux
  - "9.3"
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
Checkmk installatie op Rocky Linux 9.3

```
dnf install epel-release

setsebool -P httpd_can_network_connect 1

firewall-cmd --zone=public --add-service=http --permanent
firewall-cmd --reload

wget https://download.checkmk.com/checkmk/2.2.0p18/check-mk-raw-2.2.0p18-el9-38.x86_64.rpm
yum install check-mk-raw-2.2.0p18-el9-38.x86_64.rpm

omd version
omd create monitoring
omd start monitoring

http://localhost.localdomain/monitoring/
gebruiker: cmkadmin met wachtwoord: <opgegeven>

omd su monitoring (Voor beheer via de opdrachtregel van de site.)
cmk-passwd cmkadmin (Na het inloggen kun je het wachtwoord voor cmkadmin wijzigen met.)

(optioneel)
omd status
omd sites
omd help

(optioneel na herstart als je de foutmelding krijgt: Unable to connect)
omd update-apache-config monitoring
```

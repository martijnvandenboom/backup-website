---
title: LDAP/IPA Server installation
date: 2024-03-09T17:31:40.399Z
draft: false
categories:
  - article
tags:
  - LDAP
  - IPA
  - server
  - installation
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
\===

\# yum install ipa-server

\# ipa-server-install

\===

Hosts file aanpassen

De FQDN voor op, daarna pas de aliassen

/etc/hosts

<IP_SERVER>   <FQDN> <ALIAS1> (<ALIAS2>)

Mocht er een alias voor de FQDN staan, dan kun je foutmeldingen krijgen die hier niet meteen aan te relateren zijn.
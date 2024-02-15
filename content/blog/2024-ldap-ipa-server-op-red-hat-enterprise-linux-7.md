---
title: LDAP/IPA - Server op Red Hat Enterprise Linux 7
date: 2024-02-15T10:47:28.702Z
draft: false
categories:
  - article
tags:
  - ldap
  - ipa
  - server
  - rhel
  - red
  - hat
  - linux
  - "7"
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
A﻿ls je gebruikt maakt van een hosts file, let dan goed op dat er FQDN's in staan en de volgorde waarin.

C﻿ontroleer de hosts file en pas deze eventueel aan:

De FQDN voorop, daarna pas de aliassen.

```
/etc/hosts

10.0.0.1   server1.example.com    server1    applicatie1
```

Mocht er een alias voor de FQDN staan, dan kun je foutmeldingen krijgen die hier niet meteen aan te relateren zijn.
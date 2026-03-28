---
title: LDAP/IPA - Server on Red Hat Enterprise Linux 7
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
If you are using a hosts file, make sure it contains FQDNs and pay close attention to the order in which they appear.

Check the hosts file and adjust it if necessary:

The FQDN must come first, followed by any aliases.

```
/etc/hosts

10.0.0.1   server1.example.com    server1    application1
```

If an alias is listed before the FQDN, you may encounter error messages that are not immediately traceable to this cause.

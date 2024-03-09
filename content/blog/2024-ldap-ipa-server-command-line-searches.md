---
title: LDAP/IPA Server command line searches
date: 2024-03-09T17:34:27.901Z
draft: false
categories:
  - article
tags:
  - LDAP
  - IPA
  - server
  - command
  - line
  - searches
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
$ ldapsearch -H ldap://<FQDN_SERVER>/ -b dc=<NETWORK>,dc=com -x

$ ldapsearch -x -LLL -H ldap:/// -b dc=<NETWORK>,dc=com dn

$ ldapwhoami -x -H ldap:///

$ ldapsearch -H ldap://<IP_SERVER> -D "uid=<ADMIN_USER>,cn=users,cn=compat,dc=<NETWORK>,dc=com" -b "cn=users,cn=accounts,dc=<NETWORK>,dc=com" -x -W

$ ldapsearch -H ldap://<IP_SERVER> -D "uid=<ADMIN_USER>,cn=users,cn=compat,dc=<NETWORK>,dc=com" -b "dc=<NETWORK>,dc=com" -x -W -s one "(&(objectClass=organizationalUnit)



$ ldapsearch -h <FQDN_SERVER> -D 'uid=<ADMIN_USER>,cn=users,cn=compat,dc=<NETWORK>,dc=com' -o ldif-wrap=no -b 'dc=<NETWORK>,dc=com' -W uid=<ADMIN_USER>



$ ldapsearch -h <FQDN_SERVER> -D 'uid=<USER>,cn=users,cn=compat,dc=<NETWORK>,dc=com' -o ldif-wrap=no -b 'dc=<NETWORK>,dc=com' -W uid=<USER>
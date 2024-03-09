---
title: Configure LDAP/IPA Server with Sonarqube
date: 2024-03-09T17:35:22.094Z
draft: false
categories:
  - article
tags:
  - configure
  - LDAP
  - IPA
  - server
  - sonarqube
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
**Configure LDAP/IPA Server with Sonarqube**

\===

Sonarqube

8.9.6

sonar.properties

sonarqube-8.9.6/conf/sonar.properties

\=﻿==

sonar.security.realm=LDAP

ldap.url=ldap://<IP_SERVER>:389

ldap.bindDn=uid=<ADMIN_USER>,cn=users,cn=accounts,dc=<NETWORK>,dc=com

ldap.bindPassword=<PASSWORD>

ldap.authentication=simple

ldap.user.baseDn=cn=users,cn=accounts,dc=<NETWORK>,dc=com

\# laat volgende default

\# ldap.user.request=

\# LDAP user request. (default: (&(objectClass=inetOrgPerson)(uid={login})) )

ldap.group.baseDn=cn=groups,cn=accounts,dc=<NETWORK>,dc=com

\# laat volgende default

\# ldap.group.request=

\# LDAP group request (default: (&(objectClass=groupOfUniqueNames)(uniqueMember={dn})) )
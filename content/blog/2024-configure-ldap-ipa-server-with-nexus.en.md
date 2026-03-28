---
title: Configure LDAP/IPA Server with Nexus
date: 2024-03-09T17:37:42.650Z
draft: false
categories:
  - article
tags:
  - configure
  - LDAP
  - IPA
  - server
  - nexus
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
\===

Nexus

Sonatype Nexus Repository

OSS 3.60.0-02

\=﻿==

LDAP

ldap://<IP_SERVER>:389

cn=users,cn=accounts,dc=<NETWORK>,dc=com

Simple Authentication

uid=<ADMIN_USER>,cn=users,cn=accounts,dc=<NETWORK>,dc=com

<pw>

Next

\=﻿==

Select no template

User relative DN = leeg

User subtree = unchecked

Object class: inetOrgPerson

User filter = leeg

User ID attribute = uid

Real name attribute = cn

Email attribute = mail

Password attribute = leeg

Map LDAP groups as roles = unchecked
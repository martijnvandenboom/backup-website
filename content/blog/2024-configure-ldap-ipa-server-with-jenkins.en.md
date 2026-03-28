---
title: "Configure LDAP/IPA Server with Jenkins "
date: 2024-03-09T17:38:50.197Z
draft: false
categories:
  - article
tags:
  - configure
  - LDAP
  - IPA
  - server
  - jenkins
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
\===

Identity, Policy, and Audit (IPA) system

\===

Jenkins

2.319.2

\=﻿==

Dashboard -> Security -> Configure Global Security



Server:

ldap://<IP_SERVER>:389



root DN:

dc=<NETWORK>,dc=com



User search base

cn=users,cn=accounts



User search filter

uid={0}



Group search base

cn=groups,cn=accounts



Group membership -> Search for LDAP groups containing user -> Group membership filter:

(| (member={0}) (uniqueMember={0}) (memberUid={1}))



Manager DN:

uid=<ADMIN_USER>,cn=users,cn=accounts,dc=<NETWORK>,dc=com
---
title: "LDAP/IPA Server configureren met Jenkins"
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

Identity, Policy, and Audit (IPA) systeem

\===

Jenkins

2.319.2

\===

Dashboard -> Beveiliging -> Globale beveiliging configureren



Server:

ldap://<IP_SERVER>:389



Basis-DN:

dc=<NETWORK>,dc=com



Zoekbasis gebruikers

cn=users,cn=accounts



Zoekfilter gebruikers

uid={0}



Zoekbasis groepen

cn=groups,cn=accounts



Groepslidmaatschap -> Zoeken naar LDAP-groepen die gebruiker bevatten -> Groepslidmaatschapsfilter:

(| (member={0}) (uniqueMember={0}) (memberUid={1}))



Beheerder-DN:

uid=<ADMIN_USER>,cn=users,cn=accounts,dc=<NETWORK>,dc=com

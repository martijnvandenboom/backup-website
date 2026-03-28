---
title: LDAP/IPA Server configureren met Nexus
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

\===

LDAP

ldap://<IP_SERVER>:389

cn=users,cn=accounts,dc=<NETWORK>,dc=com

Eenvoudige verificatie

uid=<ADMIN_USER>,cn=users,cn=accounts,dc=<NETWORK>,dc=com

<pw>

Volgende

\===

Geen sjabloon selecteren

Relatieve DN gebruikers = leeg

Gebruikerssubstructuur = uitgeschakeld

Objectklasse: inetOrgPerson

Gebruikersfilter = leeg

Gebruikers-ID attribuut = uid

Echte naam attribuut = cn

E-mail attribuut = mail

Wachtwoord attribuut = leeg

LDAP-groepen als rollen koppelen = uitgeschakeld

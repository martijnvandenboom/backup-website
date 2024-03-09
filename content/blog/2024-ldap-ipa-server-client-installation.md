---
title: LDAP/IPA Server client installation
date: 2024-03-09T17:33:26.773Z
draft: false
categories:
  - article
tags:
  - LDAP
  - IPA
  - server
  - client
  - installation
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
\===

\# yum install ipa-client

\# ipa-client-install --server=<FQDN> --domain=<NETWORK> --principal=admin -W

\# ipa-client-install --server=<[ipa-server.example.com](http://ipa-server.example.com)> --domain=<example.com> --principal=admin -W
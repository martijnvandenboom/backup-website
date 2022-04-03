---
title: Installeer de editor VSCodium op Ubuntu Linux
date: 2022-04-03T14:22:24.193Z
draft: false
categories:
  - article
tags:
  - installeer
  - editor
  - vscodium
  - codium
  - ubuntu
  - linux
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
$ wget -qO - https://gitlab.com/paulcarroty/vscodium-deb-rpm-repo/raw/master/pub.gpg | sudo apt-key add -

$ sudo echo 'deb https://vscodium.c7.ee/debs/ vscodium main' | sudo tee --append /etc/apt/sources.list.d/vscodium.list

$ sudo apt update

$ sudo apt install codium
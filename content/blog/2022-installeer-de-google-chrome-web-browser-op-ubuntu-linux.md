---
title: Installeer de Google Chrome Web Browser op Ubuntu Linux
date: 2022-04-03T11:51:54.590Z
draft: false
categories:
  - article
tags:
  - Google
  - Chrome
  - Web
  - Browser
  - Ubuntu
  - Linux
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---

$ wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -

$ sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'

$ sudo apt update

$ sudo apt install google-chrome-stable
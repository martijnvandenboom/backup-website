---
title: "Stel de versie van de Python interpreter in voor de extensie: Code
  Runner in VSCodium"
date: 2022-04-03T19:55:44.371Z
draft: false
categories:
  - article
tags:
  - versie
  - version
  - python
  - python3
  - python3.9
  - coderunner
  - extensie
  - extension
  - vscodium
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
\# File name: version_used.py

\# This prints the version of Python being used by the Code Runner extension in VSCodium\
\# Set by going to: File -> Preferences -> Settings -> Search Settings -> code-runner.executorMap -> Edit in settings.json\
\# "python": "/bin/python3.9 -u",\

\# To run this script press the little play button on the top right in the editor

import sys\
print(sys.version)
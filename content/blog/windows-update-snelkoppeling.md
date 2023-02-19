---
title: Windows Update Snelkoppeling
date: 2021-12-16T09:07:17.000Z
draft: false
categories:
  - windows
  - themes
  - syntax
tags:
  - snelkoppeling
  - app
  - markdown
  - themes
author: van den Boom
comments: true
description: Commands
share: true
---
{{< highlight html >}}

Windows Update snelkoppeling die iedereen op zijn bureaublad moet hebben

* Heb je bureaublad voor je
* Klik met de rechtermuisknop
* Kies voor: Nieuw
* Kies voor: Snelkoppeling
* Vul als locatie in:

  (Op Windows 8)

  %windir%\explorer.exe shell:::{36eef7db-88ad-4e81-ad49-0e313f0c35f8} 

  (Op Windows 10)

  ms-settings:windowsupdate


* Klik op: Volgende
* Vul de naam in: Windows Update
* Klik op: Voltooien

{{< /highlight >}}
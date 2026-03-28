+++
title = "From ESD to WIM File in Windows 10"
description = "Commands"
author = "van den Boom"
date = 2020-12-12T01:44:50+01:00
tags = ["markdown", "css", "html", "themes"]
categories = ["themes", "syntax"]
+++

{{< highlight html >}}

from ESD to WIM file

> dism /Get-WimInfo /WimFile:install.esd
> dism /export-image /SourceImageFile:install.esd /SourceIndex:4 /DestinationImageFile:install.wim /Compress:max /CheckIntegrity

{{< /highlight >}}
+++
title = "Time in Alpine Linux"
description = "Commands"
author = "van den Boom"
date = 2020-12-12T19:37:42+01:00
tags = ["markdown", "css", "html", "themes"]
categories = ["themes", "syntax"]
+++

{{< highlight html >}}

> Time in Alpine Linux

> apk add tzdata
> cp /usr/share/zoneinfo/Europe/Amsterdam /etc/localtime
> echo "Europe/Amsterdam" >  /etc/timezone
> date

{{< /highlight >}}

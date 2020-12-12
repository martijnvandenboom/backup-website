+++
title = "hugo in Windows 10"
description = "Commands"
author = "van den Boom"
date = "2020-12-12"
tags = ["markdown", "css", "html", "themes"]
categories = ["themes", "syntax"]
+++

{{< highlight html >}}

> hugo new site vandenboom.icu
> cd vandenboom.icu
> git init
> git submodule add https://github.com/lxndrblz/anatole.git themes/anatole
> cd themes
> git submodule add https://github.com/pacollins/hugo-future-imperfect-slim.git
> cd ..
> hugo new blog/december-2020.md
> hugo server -D

{{< /highlight >}}
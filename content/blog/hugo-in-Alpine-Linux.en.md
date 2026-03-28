+++
title = "Hugo in Alpine Linux"
description = "Commands"
author = "van den Boom"
date = 2020-12-12T19:59:50+01:00
tags = ["markdown", "css", "html", "themes"]
categories = ["themes", "syntax"]
+++

{{< highlight html >}}

Hugo in Alpine Linux

> apk update
> apk upgrade
> apk add git
> apk add go

> wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub
> wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.32-r0/glibc-2.32-r0.apk
> apk add glibc-2.32-r0.apk

> wget https://github.com/gohugoio/hugo/releases/download/v0.79.0/hugo_0.79.0_Linux-32bit.tar.gz
> tar -xvzf hugo_0.79.0_Linux-32bit.tar.gz 
> ./hugo
> ./hugo version

> echo $SHELL
> vim .bash_profile
export PATH=$PATH:/hugo/bin

> source .bash_profile 
> which hugo

> cd website/
> hugo new blog/time-in-alpine.md
> vim ./content/blog/time-in-alpine.md

> git add --all
> git commit -m "set time in Alpine Linux"
> git push

{{< /highlight >}}

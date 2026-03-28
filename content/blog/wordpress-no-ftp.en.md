+++
title = "Wordpress no FTP needed"
description = "Commands"
author = "van den Boom"
date = 2020-12-19T11:22:46+01:00
tags = ["markdown", "css", "html", "themes"]
categories = ["themes", "syntax"]
+++

{{< highlight html >}}

add this line to: wp-config.php
define('FS_METHOD', 'direct');

{{< /highlight >}}

+++
title = "WordPress zonder FTP"
description = "Opdrachten"
author = "van den Boom"
date = 2020-12-19T11:22:46+01:00
tags = ["markdown", "css", "html", "themes"]
categories = ["themes", "syntax"]
+++

{{< highlight html >}}

voeg deze regel toe aan: wp-config.php
define('FS_METHOD', 'direct');

{{< /highlight >}}

---
title: Concourse starting automatically at boot with systemctl service
date: 2022-06-16T18:55:47.207Z
draft: false
categories:
  - article
tags:
  - Concourse
  - starting
  - automatically
  - boot
  - systemctl
  - service
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
```
/home/martijn/Downloads/concourse
$ curl -LO https://concourse-ci.org/docker-compose.yml

$ cat /etc/systemd/system/docker-compose-concourse.service

[Unit]
Description=Docker Compose Application Service for Concourse
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/martijn/Downloads/concourse
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```
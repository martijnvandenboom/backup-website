---
title: SSH naar een externe machine met SSH-sleutels en commando uitvoeren in nieuw Python 3
date: 2024-04-03T20:20:39.976Z
draft: false
categories:
  - article
tags:
  - ssh
  - remote
  - machine
  - keys
  - commands
  - new
  - python
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
O﻿m een script te maken voor het uitvoeren van externe commando's in een client-servernetwerk.

```
import subprocess

def ssh_exec_command(hostname, username, command):
    ssh_cmd = ['ssh', f'{username}@{hostname}', command]
    ssh_process = subprocess.Popen(
        ssh_cmd,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    output, error = ssh_process.communicate()

    if error:
        print("Error:", error)
    else:
        print("Output:", output)

# Vervang deze door uw werkelijke inloggegevens en commando
hostname = 'remote_host_address'
username = 'your_username'
command = 'ls -l'

ssh_exec_command(hostname, username, command)
```

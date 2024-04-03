---
title: SSH in remote machine with SSH keys and run command in new Python 3
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
T﻿o make a script to run remote commands in a client server network.

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

# Replace these with your actual credentials and command
hostname = 'remote_host_address'
username = 'your_username'
command = 'ls -l'

ssh_exec_command(hostname, username, command)
```
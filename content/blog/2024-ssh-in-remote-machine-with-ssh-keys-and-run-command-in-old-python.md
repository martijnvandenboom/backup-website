---
title: SSH in remote machine with SSH keys and run command in old Python
date: 2024-04-03T20:12:58.290Z
draft: false
categories:
  - article
tags:
  - ssh
  - remote
  - machine
  - keys
  - command
  - old
  - python
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
I﻿n case you have an old legacy system with Python 2 still in use and want to make a script to run certain commands in a client server network.

```
import subprocess

def ssh_exec_command(hostname, username, private_key_path, command):
    ssh_cmd = ['ssh', '-i', private_key_path, '-o', 'StrictHostKeyChecking=no', f'{username}@{hostname}', command]
    ssh_process = subprocess.Popen(
        ssh_cmd,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    output, error = ssh_process.communicate()

    if error:
        print("Error:", error)
    else:
        print("Output:", output)

# Replace these with your actual credentials and command
hostname = 'remote_host_address'
username = 'your_username'
private_key_path = '/path/to/your/private_key'
command = 'ls -l'

ssh_exec_command(hostname, username, private_key_path, command)
```
---
title: Automatically log in to a Linux server using PuTTY on Windows
date: 2023-02-17T14:51:15.829Z
draft: false
categories:
  - article
tags:
  - automatisch
  - inloggen
  - linux
  - server
  - putty
  - windows
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---

You can automatically log in to a Linux server on Windows using PuTTY by making use of a key file. Below I explain step by step how to do this.

1. Create a key: start: puttygen.exe
2. Click on: Generate
3. Click on: Save private key
4. Go to PuTTY Configuration -> Session
5. Load a previously created session or create a new one
6. Go to: Connection -> SSH -> Auth -> Private key file for authentication -> Browse
7. Select your file with the private key: *.ppk
8. Go back to Session and click on: Save
9. Log in to the Linux server using the Saved Sessions and still with your password
10. Create a new directory in the home directory: .ssh
11. Give this directory the correct permissions: chmod 700 ~/.ssh
12. Create and edit the file authorized_keys: vi ~/ssh/authorized_keys
13. Copy the Public key for pasting from the PuTTY Key Generator
14. Paste it into the authorized_keys file on the Linux server
15. Save the authorized_keys file (for vi type: :wq)
16. Give this file the correct permissions: chmod 600 ~/.ssh/authorized_keys
17. Close the logged-in PuTTY session to the Linux Server
18. Open the session again to verify that you can now log in automatically

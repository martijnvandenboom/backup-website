---
title: Authomatisch inloggen op een Linux server m.b.v. PuTTY onder Windows
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


J﻿e kunt onder Windows met PuTTY automatisch op een Linux server inloggen door gebruik te maken van een key file. Hieronder leg ik stap voor stap uit hoe je dit doet.



1. Maak een key aan: start: puttygen.exe
2. Klik op: Generate
3. Klik op: Save private key
4. Ga naar PuTTY Configuration -> Session
5. Laad een eerder gemaakte sessie of maak een nieuwe
6. Ga naar: Connection -> SSH -> Auth -> Private key file for authentication -> Browse
7. Selecteer je bestand met de private key: *.ppk
8. Ga terug naar Session en klik op: Save
9. Login op de Linux server m.b.v. de Saved Sessions en nog met je wachtwoord
10. Maak in de home directory een nieuwe map: .ssh
11. Geef deze map de juiste rechten: chmod 700 ~/.ssh
12. Maak en edit het bestand authorized_keys: vi ~/ssh/authorized_keys
13. Kopieer de Public key for pasting in de PuTTY Key Generator
14. Plak deze in de file authorized_keys op de Linux server
15. Save de authorized_keys file (voor vi type je :wq)
16. Geef deze file de juiste rechten: chmod 600 ~/.ssh/authorized_keys
17. Sluit de ingelogde sessie met PuTTY naar de Linux Server af
18. Open de sessie opnieuw om te controleren dat je nu automatisch kunt inloggen
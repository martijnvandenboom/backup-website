---
title: Maak een Zombie proces in Linux m.b.v. een C programma
date: 2024-01-31T20:54:45.709Z
draft: false
categories:
  - article
tags:
  - zombie
  - proces
  - linux
  - C
  - programma
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
Hierbij de broncode van een C programma om een Zombie proces in Linux te maken en deze te kunnen analyseren.

```
vim create_zombie_process.c
```

```
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main ()
{
  pid_t child_pid;

  child_pid = fork ();
  if (child_pid > 0) {
    sleep (60);
  }
  else {
    exit (0);
  }
  return 0;
}
```

C﻿ompileer de C broncode in een uitvoerbaar programma:

```
gcc create_zombie_process.c
```

S﻿tart het programma:

```
./a.out
```

O﻿pen een tweede Terminal en bekijk de proces lijst, hier zie je nu een proces met een STAT: Z en de tekst: defunct

```
ps au --forest
```
---
title: Create a Zombie process in Linux using a C program
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
Below is the source code of a C program to create a Zombie process in Linux and analyse it.

```
vim create_zombie_process.c
```

```c
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

Compile the C source code into an executable program:

```
gcc create_zombie_process.c
```

Start the program:

```
./a.out
```

Open a second Terminal and view the process list. You will now see a process with STAT: Z and the text: defunct

```
ps au --forest
```

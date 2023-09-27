---
title: Multiple versions of Java on macOS
date: 2023-09-27T17:43:18.381Z
draft: false
categories:
  - article
tags:
  - multiple
  - versions
  - Java
  - macOS
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
```
ls -al /usr/local/opt/ | grep -i openjdk

$ brew install jenv

$ jenv add /Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home/

$ jenv versions
$ jenv local 1.8
$ java -version
$ jenv global 1.8
$ java -version
$ jenv shell 1.8
$ java -version
$ jenv versions
```
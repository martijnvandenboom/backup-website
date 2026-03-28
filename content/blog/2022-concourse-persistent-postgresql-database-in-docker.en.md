---
title: Concourse persistent PostgreSQL database in Docker
date: 2022-06-16T18:50:41.108Z
draft: false
categories:
  - article
tags:
  - Concourse
  - persistent
  - PostgreSQL
  - Database
  - Docker
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
```
$ sudo docker-compose stop concourse-db

$ sudo docker ps
$ sudo docker cp -a <docker postgresql database id>:/database .\

$ vim docker-compose.yml
	image: postgres
	volumes: \["./database:/database"]
	environment:

$ sudo docker-compose up -d --no-deps concourse-db
```
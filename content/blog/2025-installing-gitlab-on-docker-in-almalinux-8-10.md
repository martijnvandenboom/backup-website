---
title: GitLab installeren op Docker in AlmaLinux 8.10
date: 2025-03-29T20:21:32.130Z
draft: false
categories:
  - article
tags:
  - install
  - GitLab
  - Docker
  - AlmaLinux
  - "8.10"
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---

Stap 1: Systeem bijwerken

<pre><code>$ sudo dnf update
$ sudo dnf install epel-release
$ sudo /usr/bin/crb enable
</code></pre>

Stap 2: Docker installeren vanuit de AlmaLinux-repository

<pre><code>$ sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
$ sudo dnf remove -y podman podman-docker podman-plugins
$ sudo dnf remove -y runc
$ sudo dnf clean all
$ sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
$ sudo systemctl enable --now docker
$ sudo systemctl status docker
$ sudo usermod -aG docker $USER
</code></pre>

Stap 3: Uitloggen en opnieuw inloggen

<pre><code>$ docker compose version
</code></pre>

Stap 4: Permanente opslag instellen

<pre><code>$ sudo mkdir -p /srv/gitlab/{config,logs,data}
$ sudo chown -R 1000:1000 /srv/gitlab
$ sudo chmod -R 755 /srv/gitlab
</code></pre>

Stap 5: GitLab implementeren met Docker

<pre><code>$ cd Downloads
$ mkdir gitlab
$ cd gitlab
$ vim docker-compose.yml

version: '3'
services:
  gitlab:
    image: gitlab/gitlab-ce:latest
    container_name: gitlab
    restart: always
    hostname: gitlab.example.com
    ports:
      - "80:80"
      - "443:443"
      - "2222:22"
    volumes:
      - /srv/gitlab/config:/etc/gitlab
      - /srv/gitlab/logs:/var/log/gitlab
      - /srv/gitlab/data:/var/opt/gitlab
    shm_size: "256m"
</code></pre>

Stap 6: GitLab starten

<pre><code>$ docker compose up -d
$ docker logs -f gitlab
</code></pre>

Stap 7: Het initiële root-wachtwoord ophalen

<pre><code>$ sudo cat /srv/gitlab/config/initial_root_password
</code></pre>

Stap 8: (Optioneel) HTTPS inschakelen voor beveiligde toegang

Als u een .local-domein heeft
Gebruik een zelfondertekend SSL-certificaat
SSL-certificaten genereren:
<pre><code>$ sudo mkdir -p /srv/gitlab/config/ssl
$ cd /srv/gitlab/config/ssl
$ sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout gitlab.vandenboom.local.key -out gitlab.vandenboom.local.crt

Country Name (2 letter code) [XX]:NL
State or Province Name (full name) []:UTRECHT
Locality Name (eg, city) [Default City]:UTRECHT
Organization Name (eg, company) [Default Company Ltd]:https://www.vandenboom.icu
Organizational Unit Name (eg, section) []:private
Common Name (eg, your name or your server''s hostname) []:gitlab.vandenboom.local
Email Address []:martijn.vandenboom@icloud.com
</code></pre>

Juiste machtigingen instellen
<pre><code>$ sudo chmod 600 /srv/gitlab/config/ssl/*
$ sudo chown 1000:1000 /srv/gitlab/config/ssl/*
</code></pre>

docker-compose.yml bijwerken om de SSL-map te koppelen
<pre><code>$ cd ~/Downloads/gitlab
$ vim docker-compose

version: '3'
services:
  gitlab:
  image: gitlab/gitlab-ce:latest
    container_name: gitlab
    restart: always
    hostname: gitlab.vandenboom.local
    ports:
      - "80:80"
      - "443:443"
      - "2222:22" # Voorkom conflict met systeem-SSH
    volumes:
      - /srv/gitlab/config:/etc/gitlab
      - /srv/gitlab/logs:/var/log/gitlab
      - /srv/gitlab/data:/var/opt/gitlab
      - /srv/gitlab/config/ssl:/etc/gitlab/ssl # SSL-map correct koppelen
    shm_size: "256m"
</code></pre>

gitlab.rb bijwerken
<pre><code>$ sudo vim /srv/gitlab/config/gitlab.rb

external_url 'https://gitlab.vandenboom.local'
nginx['ssl_certificate'] = "/etc/gitlab/ssl/gitlab.vandenboom.local.crt"
nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/gitlab.vandenboom.local.key"
</code></pre>

GitLab opnieuw configureren om wijzigingen toe te passen:
<pre><code>$ cd ~/Downloads/gitlab
$ docker compose down
$ docker compose up -d

GitLab opnieuw configureren in de container:
$ docker exec -it gitlab gitlab-ctl reconfigure

GitLab herstarten:
$ docker restart gitlab
</code></pre>


Stap 9: Inloggen op GitLab

Open in een browser de link: [http(s)://gitlab.example.com](http://gitlab.example.com)

Voor .local-domein en zelfondertekende certificaten:
Omdat het een zelfondertekend certificaat is, toont uw browser een beveiligingswaarschuwing. U moet het certificaat handmatig vertrouwen.

Gebruikersnaam: root
Wachtwoord: (gebruik het wachtwoord uit de vorige stap 7)

Stap 10: Uw wachtwoord wijzigen (aanbevolen)

Ga na het inloggen naar Profiel → Profiel bewerken → Wachtwoord en stel een nieuw wachtwoord in.

Stap 11: Zorgen dat Docker Compose-services herstarten bij opstarten
<pre><code>$ sudo vim /etc/systemd/system/gitlab.service

[Unit]
Description=GitLab Docker Container
Requires=docker.service
After=docker.service

[Service]
User=mboom
Group=mboom
Type=oneshot
ExecStart=/usr/bin/docker compose -f /home/mboom/Downloads/gitlab/docker-compose.yml up -d
ExecStop=/usr/bin/docker compose -f /home/mboom/Downloads/gitlab/docker-compose.yml down
WorkingDirectory=/home/mboom/Downloads/gitlab
TimeoutStartSec=30s
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
</code></pre>

<pre><code>$ sudo systemctl daemon-reload
$ sudo systemctl enable gitlab

Controleer of GitLab start na herstart:
$ sudo reboot
$ docker ps
$ watch 'docker ps'

Wacht totdat het proces de status 'healthy' heeft, dit duurt ongeveer 5 minuten
</code></pre>

Stap X: GitLab bijwerken

<pre><code>Maak een back-up van de volumes:
$ sudo cp -a /srv/gitlab/config /srv/gitlab/config_$(date +"%Y%m%d_%H%M%S")
$ sudo cp -a /srv/gitlab/logs /srv/gitlab/logs_$(date +"%Y%m%d_%H%M%S")
$ sudo cp -a /srv/gitlab/data /srv/gitlab/data_$(date +"%Y%m%d_%H%M%S")

$ docker compose down
$ docker compose pull
$ docker compose up -d
</code></pre>

---
title: Installing GitLab on Docker in AlmaLinux 8.10
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

Step 1: Update System

<pre><code>$ sudo dnf update
$ sudo dnf install epel-release
$ sudo /usr/bin/crb enable
</code></pre>

Step 2: Install Docker from AlmaLinux Repo

<pre><code>$ sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
$ sudo dnf remove -y podman podman-docker podman-plugins
$ sudo dnf remove -y runc
$ sudo dnf clean all
$ sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
$ sudo systemctl enable --now docker
$ sudo systemctl status docker
$ sudo usermod -aG docker $USER
</code></pre>

Step 3: Logout and back in

<pre><code>$ docker compose version
</code></pre>

Step 4: Set Up Persistent Storage

<pre><code>$ sudo mkdir -p /srv/gitlab/{config,logs,data}
$ sudo chown -R 1000:1000 /srv/gitlab
$ sudo chmod -R 755 /srv/gitlab
</code></pre>

Step 5: Deploy GitLab with Docker

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
      - “2222:22"
    volumes:
      - /srv/gitlab/config:/etc/gitlab
      - /srv/gitlab/logs:/var/log/gitlab
      - /srv/gitlab/data:/var/opt/gitlab
    shm_size: "256m"
</code></pre>

Step 6: Start GitLab

<pre><code>$ docker compose up -d
$ docker logs -f gitlab
</code></pre>

Step 7: Retrieve the Initial Root Password

<pre><code>$ sudo cat /srv/gitlab/config/initial_root_password
</code></pre>

Step 8: (Optional) Enable HTTPS for Secure Access

If you have a .local domain
Use a Self-Signed SSL Certificate
Generate SSL Certificates:
<pre><code>$ sudo mkdir -p /srv/gitlab/config/ssl
$ cd /srv/gitlab/config/ssl
$ sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout gitlab.vandenboom.local.key -out gitlab.vandenboom.local.crt

Country Name (2 letter code) [XX]:NL
State or Province Name (full name) []:UTRECHT
Locality Name (eg, city) [Default City]:UTRECHT
Organization Name (eg, company) [Default Company Ltd]:https://www.vandenboom.icu
Organizational Unit Name (eg, section) []:private
Common Name (eg, your name or your server\'s hostname) []:gitlab.vandenboom.local
Email Address []:martijn.vandenboom@icloud.com
</code></pre>

Set Correct Permissions
<pre><code>$ sudo chmod 600 /srv/gitlab/config/ssl/*
$ sudo chown 1000:1000 /srv/gitlab/config/ssl/*
</code></pre>

Update docker-compose.yml to Mount the SSL Directory
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
      - "2222:22" # Avoid conflict with system SSH
    volumes:
      - /srv/gitlab/config:/etc/gitlab
      - /srv/gitlab/logs:/var/log/gitlab
      - /srv/gitlab/data:/var/opt/gitlab
      - /srv/gitlab/config/ssl:/etc/gitlab/ssl # Mount SSL directory correctly
    shm_size: "256m"
</code></pre>

Update gitlab.rb
<pre><code>$ sudo vim /srv/gitlab/config/gitlab.rb

external_url 'https://gitlab.vandenboom.local'
nginx['ssl_certificate'] = "/etc/gitlab/ssl/gitlab.vandenboom.local.crt"
nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/gitlab.vandenboom.local.key"
</code></pre>

Reconfigure GitLab to apply changes:
<pre><code>$ cd ~/Downloads/gitlab
$ docker compose down
$ docker compose up -d

Reconfigure GitLab inside the container:
$ docker exec -it gitlab gitlab-ctl reconfigure

Restart GitLab:
$ docker restart gitlab
</code></pre>


Step 9: Login to GitLab

In a browser open the link: [http(s)://gitlab.example.com](http://gitlab.example.com)

For .local domain and self-signed certificates:
Since it's a self-signed certificate, your browser will show a security warning. You'll need to manually trust the certificate.

Username: root
Password: (Use the password from the previous step 7)

Step 10: Change Your Password (Recommended)

Once logged in, go to Profile → Edit Profile → Password and set a new password.

Step 11: Ensure Docker Compose Services Restart on Boot
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

Verify GitLab starts after reboot:
$ sudo reboot
$ docker ps
$ watch 'docker ps'

Watch until the proces says: healthy, it take approx. 5 mins for it to be fully running
</code></pre>

Step X: Updating GitLab

<pre><code>Make a backup of the volumes:
$ sudo cp -a /srv/gitlab/config /srv/gitlab/config_$(date +"%Y%m%d_%H%M%S")
$ sudo cp -a /srv/gitlab/logs /srv/gitlab/logs_$(date +"%Y%m%d_%H%M%S")
$ sudo cp -a /srv/gitlab/data /srv/gitlab/data_$(date +"%Y%m%d_%H%M%S")

$ docker compose down
$ docker compose pull
$ docker compose up -d
</code></pre>
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

> $ sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo\
> $ sudo dnf remove -y podman podman-docker podman-plugins\
> $ sudo dnf remove -y runc\
> $ sudo dnf clean all\
> $ sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin\
> $﻿ sudo systemctl enable --now docker\
> $﻿ sudo systemctl status docker\p
> $﻿ sudo usermod -aG docker $USER
>
> Logout and back in\
> \
> $ docker compose version

Step 4: Set Up Persistent Storage

> $ sudo mkdir -p /srv/gitlab/{config,logs,data}\
> $ sudo chown -R 1000:1000 /srv/gitlab\
> $﻿ sudo chmod -R 755 /srv/gitlab

Step 5: Deploy GitLab with Docker

$ cd Downloads\
$ mkdir gitlab\
$ cd gitlab\
$ vim docker-compose.yml

> version: '3'\
> services:\
>   gitlab:\
>     image: gitlab/gitlab-ce:latest\
>     container_name: gitlab\
>     restart: always\
>     hostname: gitlab.example.com\
>     ports:\
>       - "80:80"\
>       - "443:443"\
>       - “2222:22"\
>     volumes:\
>       - /srv/gitlab/config:/etc/gitlab\
>       - /srv/gitlab/logs:/var/log/gitlab\
>       - /srv/gitlab/data:/var/opt/gitlab\
>     shm_size: "256m"

Step 6: Start GitLab

> $ docker compose up -d\
> $ docker logs -f gitlab

Step 7: Retrieve the Initial Root Password

> $ sudo cat /srv/gitlab/config/initial_root_password

Step 8: (Optional) Enable HTTPS for Secure Access

A.

> If you have a domain, with .com, .org, .net configure Let's Encrypt SSL\
> $ sudo vim /srv/gitlab/config/gitlab.rb
>
> external_url '[https://gitlab.example.com’](https://gitlab.example.xn--com-to0a)\
> letsencrypt\['enable'] = true\
> \
> Then, apply changes:\
> $ docker exec -it gitlab gitlab-ctl reconfigure

B.

> If you have a .local domain\
> Use a Self-Signed SSL Certificate\
> Generate SSL Certificates:\
> \
> $ sudo mkdir -p /srv/gitlab/config/ssl\
> $ cd /srv/gitlab/config/ssl\
> $ sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout gitlab.vandenboom.local.key -out gitlab.vandenboom.local.crt\
> \
> Country Name (2 letter code) \[XX]:NL\
> State or Province Name (full name) \[]:UTRECHT\
> Locality Name (eg, city) \[Default City]:UTRECHT\
> Organization Name (eg, company) \[Default Company Ltd]:vandenboom.local\
> Organizational Unit Name (eg, section) \[]:private\
> Common Name (eg, your name or your server's hostname) \[]:gitlab.vandenboom.local\
> Email Address \[]:martijn.vandenboom@icloud.com\
> \
> Set Correct Permissions\
> $ sudo chmod 600 /srv/gitlab/config/ssl/*\
> $ sudo chown 1000:1000 /srv/gitlab/config/ssl/*\
> \
> Update docker-compose.yml to Mount the SSL Directory\
> \
> version: '3'\
> services:\
>   gitlab:\
>     image: gitlab/gitlab-ce:latest\
>     container_name: gitlab\
>     restart: always\
>     hostname: gitlab.vandenboom.local\
>     ports:\
>       - "80:80"\
>       - "443:443"\
>       - "2222:22" # Avoid conflict with system SSH\
>     volumes:\
>       - /srv/gitlab/config:/etc/gitlab\
>       - /srv/gitlab/logs:/var/log/gitlab\
>       - /srv/gitlab/data:/var/opt/gitlab\
>       - /srv/gitlab/config/ssl:/etc/gitlab/ssl # Mount SSL directory correctly\
>     shm_size: "256m"
>
> Update gitlab.rb\
> $ sudo vim /srv/gitlab/config/gitlab.rb\
> \
> external_url 'https://gitlab.vandenboom.local'\
> nginx\['ssl_certificate'] = "/etc/gitlab/ssl/gitlab.vandenboom.local.crt"\
> nginx\['ssl_certificate_key'] = "/etc/gitlab/ssl/gitlab.vandenboom.local.key"
>
> Reconfigure GitLab to apply changes:\
> $ cd ~/Downlaods/gitlab\
> $ docker compose down\
> $ docker compose up -d
>
> Reconfigure GitLab inside the container:\
> $ docker exec -it gitlab gitlab-ctl reconfigure
>
> Restart GitLab:\
> $ docker restart gitlab

Step 9: Login to GitLab

In a browser open the link: [http(s)://gitlab.example.com](http://gitlab.example.com)\
\
For .local domain and self-signed certificates:\
Since it's a self-signed certificate, your browser will show a security warning. You'll need to manually trust the certificate.\
\
Username: root\
Password: (Use the password from the previous step 7)

Step 10: Change Your Password (Recommended)

Once logged in, go to Profile → Edit Profile → Password and set a new password.

Step 11: Ensure Docker Compose Services Restart on Boot

> $ sudo vim /etc/systemd/system/gitlab.service
>
> > \[Unit]\
> > Description=GitLab Docker Container\
> > Requires=docker.service\
> > After=docker.service\
> > \
> > \[Service]\
> > User=mboom\
> > Group=mboom\
> > Type=oneshot\
> > ExecStart=/usr/bin/docker compose -f /home/mboom/Downloads/gitlab/docker-compose.yml up -d\
> > ExecStop=/usr/bin/docker compose -f /home/mboom/Downloads/gitlab/docker-compose.yml down\
> > WorkingDirectory=/home/mboom/Downloads/gitlab\
> > TimeoutStartSec=30s\
> > RemainAfterExit=yes
> >
> > \[Install]\
> > WantedBy=multi-user.target
>
> $ sudo systemctl daemon-reload\
> $ sudo systemctl enable gitlab\
> \
> Verify GitLab starts after reboot:\
> \
> $ sudo reboot\
> $ docker ps\
> $ watch 'docker ps'\
> \
> Watch until the proces says: healthy, it take approx. 5 mins for it to be fully running

Step X: Updating GitLab

> Make a backup of the volumes:\
> $ sudo cp -a /srv/gitlab/config /srv/gitlab/config\_$(date +"%Y%m%d\_%H%M%S")\
> $ sudo cp -a /srv/gitlab/logs /srv/gitlab/logs\_$(date +"%Y%m%d\_%H%M%S")\
> $ sudo cp -a /srv/gitlab/data /srv/gitlab/data\_$(date +"%Y%m%d\_%H%M%S")\
> \
> $ docker compose down\
> $ docker compose pull\
> $ docker compose up -d
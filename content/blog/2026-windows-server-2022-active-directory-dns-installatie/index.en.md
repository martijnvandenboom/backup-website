---
title: "Windows Server 2022 — Active Directory and DNS Installation"
date: 2026-03-27T00:00:00+01:00
description: "Step-by-step installation guide for Active Directory Domain Services and DNS on Windows Server 2022 in a VMware Fusion lab environment. With screenshots of every step."
categories:
  - article
  - windows
tags:
  - windows
  - active-directory
  - dns
  - windows-server-2022
  - vmware
  - lab
  - devops
  - domain-controller
author: "ing. M.A.C.M. (Martijn) van den Boom"
---

In this article I describe step by step how I installed Active Directory Domain Services (AD DS) and DNS on a Windows Server 2022 Datacenter VM in a VMware Fusion lab environment. The result is a fully functional domain controller for the domain **lab.local**, as the foundation for a Windows DevOps lab.

## Environment

| Component | Value |
|---|---|
| Virtualisation | VMware Fusion (macOS) |
| Guest operating system | Windows Server 2022 Datacenter (Desktop Experience) |
| Hostname | DC01 |
| Domain name | lab.local |
| NetBIOS name | LAB |
| Lab network adapter | Ethernet1 — 172.16.37.10 (static IP) |
| Internet adapter | Ethernet0 — DHCP via VMware NAT |

---

## Step 1 — Configure Networking

Before installing Active Directory, the domain controller needs a static IP address. AD DS and DNS depend on a stable address.

The VM has two network adapters: one for internet access (NAT, DHCP) and one for the lab network (Private to my Mac, static IP).

### 1.1 Add a second network adapter in VMware Fusion

The VM must be powered off before adding a second network adapter. Go to **VM > Settings** and add a new Network Adapter. Set it to **Private to my Mac**.

![VMware Fusion network settings — Private to my Mac](/images/2026-windows-server-2022-ad-dns/vmware-fusion-netwerk-private-to-my-mac.png)
*VMware Fusion network settings: Private to my Mac is the isolated lab network*

### 1.2 Set a static IP on Ethernet1

Open **Control Panel > Network Connections**. Right-click **Ethernet1 > Properties > Internet Protocol Version 4 (TCP/IPv4) > Properties**.

Enter the following values:

- **IP address:** `172.16.37.10`
- **Subnet mask:** `255.255.255.0`
- **Default gateway:** leave blank
- **Preferred DNS server:** `172.16.37.10` (DC01 points to itself)

![IPv4 Properties — setting a static IP](/images/2026-windows-server-2022-ad-dns/ipv4-statisch-ip-instellen.png)
*IPv4 Properties: static IP 172.16.37.10 for the lab network. Leave the gateway blank — internet traffic runs via Ethernet0.*

> **Note:** Ethernet0 (internet) remains on DHCP. Only Ethernet1 gets a static IP. This way the VM works anywhere — at home, at work, at a family member's place — because the internal lab network is fully isolated from the local network.

### 1.3 Verification

Open PowerShell and verify:

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Select-Object InterfaceAlias, IPAddress
```

Expected result:

```
Ethernet1        172.16.37.10
Ethernet0        192.168.x.x   (varies via DHCP)
```

---

## Step 2 — Install the AD DS Role via Server Manager

### 2.1 Open Server Manager

Server Manager opens automatically after logging in. Dismiss the Windows Admin Center notification.

![Windows Admin Center notification](/images/2026-windows-server-2022-ad-dns/server-manager-admin-center-melding.png)
*Check "Don't show this message again" and close this window*

![Server Manager Dashboard](/images/2026-windows-server-2022-ad-dns/server-manager-dashboard.png)
*Server Manager Dashboard — the starting point for all server management*

### 2.2 Add a role

Click **Add roles and features** in the Dashboard.

![Installation Type — Role-based](/images/2026-windows-server-2022-ad-dns/add-roles-installation-type.png)
*Choose Role-based or feature-based installation. DC01 is already shown as the destination server in the top right.*

![Server Selection — DC01](/images/2026-windows-server-2022-ad-dns/add-roles-server-selection.png)
*DC01 is already selected in the server pool. Click Next.*

### 2.3 Select Active Directory Domain Services

Check **Active Directory Domain Services**. A popup will appear for additional required features — click **Add Features**.

![Server Roles — selecting AD DS](/images/2026-windows-server-2022-ad-dns/add-roles-server-roles-ad-ds.png)
*Check Active Directory Domain Services in the list*

![Features — nothing extra to select](/images/2026-windows-server-2022-ad-dns/add-roles-features.png)
*No extra features required. Everything needed is already checked.*

### 2.4 AD DS information page

![AD DS information page](/images/2026-windows-server-2022-ad-dns/ad-ds-informatiepagina.png)
*Information page about AD DS. Important: DNS will be installed automatically.*

### 2.5 Confirm installation

Check **Restart the destination server automatically if required** and click **Install**.

![Confirmation — installation overview](/images/2026-windows-server-2022-ad-dns/add-roles-confirmation.png)
*Overview of all components that will be installed*

### 2.6 Installation successful

![Installation Results — succeeded](/images/2026-windows-server-2022-ad-dns/add-roles-installation-geslaagd.png)
*Installation succeeded on DC01. Now click the blue link "Promote this server to a domain controller".*

> **Note:** The AD DS role is now installed but DC01 is not yet a domain controller. The link "Promote this server to a domain controller" is the next step.

---

## Step 3 — Configure the Domain Controller

### 3.1 Deployment Configuration

Choose **Add a new forest** and enter the root domain name: `lab.local`

![Deployment Configuration — new forest](/images/2026-windows-server-2022-ad-dns/dc-deployment-configuration-nieuw-forest.png)
*Choose Add a new forest for a completely new domain. Domain name: lab.local*

### 3.2 Domain Controller Options

The functional levels are set to **Windows Server 2016** — perfectly suitable for a modern lab. DNS Server and Global Catalog are checked.

Set the **DSRM password**. This is an emergency password for Active Directory recovery — store it somewhere safe.

![Domain Controller Options](/images/2026-windows-server-2022-ad-dns/dc-domain-controller-options.png)
*Functional level 2016, DNS Server and Global Catalog checked. Fill in the DSRM password.*

### 3.3 DNS Options

A warning about DNS delegation will appear. This is **normal for an internal lab domain** such as `lab.local` that does not exist on the public internet. Leave **Create DNS delegation** unchecked.

![DNS Options — warning is normal](/images/2026-windows-server-2022-ad-dns/dc-dns-options.png)
*The DNS delegation warning is normal for a private lab domain. No action required.*

### 3.4 NetBIOS name

Windows automatically sets the NetBIOS name to **LAB**. Wait for the field to populate.

![Additional Options — NetBIOS loading](/images/2026-windows-server-2022-ad-dns/dc-additional-options-netbios-leeg.png)
*Wait a moment for the NetBIOS name to appear automatically*

![Additional Options — NetBIOS is LAB](/images/2026-windows-server-2022-ad-dns/dc-additional-options-netbios-lab.png)
*NetBIOS name is LAB — without the .local extension. You will later log in as LAB\Administrator.*

### 3.5 File paths

For a lab environment the default locations are fine.

![Paths — default locations](/images/2026-windows-server-2022-ad-dns/dc-paths.png)
*Default locations for the AD DS database (NTDS) and SYSVOL. Leave as-is.*

### 3.6 Review Options

Check the summary:

- Domain: `lab.local`
- NetBIOS: `LAB`
- DNS Server: Yes
- Global Catalog: Yes
- Create DNS Delegation: No

![Review Options — summary](/images/2026-windows-server-2022-ad-dns/dc-review-options.png)
*Summary of the configuration. Everything looks correct — click Next.*

### 3.7 Prerequisites Check

The green checkmark confirms that all checks have passed. The yellow warnings are normal for a lab.

![Prerequisites Check — passed](/images/2026-windows-server-2022-ad-dns/dc-prerequisites-check-geslaagd.png)
*Green checkmark: All prerequisite checks passed. Click Install.*

### 3.8 Installation

The server configures DNS and restarts automatically.

![Installation — DNS being configured](/images/2026-windows-server-2022-ad-dns/dc-installation-dns-configureren.png)
*DNS Server service is being configured. After completion, DC01 restarts automatically.*

> **After the reboot:** Log in as `LAB\Administrator` instead of as the local Administrator.

---

## Step 4 — Post-Installation Verification

Open PowerShell as Administrator and verify:

```powershell
# Domain information
Get-ADDomain

# Domain controller information
Get-ADDomainController

# Check DNS zones
Get-DnsServerZone

# Test name resolution
Resolve-DnsName dc01.lab.local
```

If `Resolve-DnsName dc01.lab.local` returns the IP address `172.16.37.10`, DNS is working correctly.

---

## Next Steps

Now that DC01 is functioning as a domain controller for `lab.local`, the next steps are:

- **CA01** — Certificate Authority for internal TLS certificates (Jenkins, Harbor, Nexus)
- **Join other VMs to lab.local** — point DNS to `172.16.37.10` on each new VM
- **Create Organisational Units and service accounts** for Jenkins, Ansible and Nexus

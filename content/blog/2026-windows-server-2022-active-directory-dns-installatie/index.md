---
title: "Windows Server 2022 — Active Directory en DNS installatie"
date: 2026-03-27T00:00:00+01:00
description: "Stap voor stap installatiehandleiding voor Active Directory Domain Services en DNS op Windows Server 2022 in een VMware Fusion lab omgeving. Met screenshots van elke stap."
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
  - domeincontroller
author: "ing. M.A.C.M. (Martijn) van den Boom"
---

In dit artikel beschrijf ik stap voor stap hoe ik Active Directory Domain Services (AD DS) en DNS heb geïnstalleerd op een Windows Server 2022 Datacenter VM in een VMware Fusion lab omgeving. Het resultaat is een volledig functionele domeincontroller voor het domein **lab.local**, als basis voor een Windows DevOps lab.

## Omgeving

| Onderdeel | Waarde |
|---|---|
| Virtualisatie | VMware Fusion (macOS) |
| Gastbesturingssysteem | Windows Server 2022 Datacenter (Desktop Experience) |
| Hostnaam | DC01 |
| Domeinnaam | lab.local |
| NetBIOS naam | LAB |
| Lab-netwerk adapter | Ethernet1 — 172.16.37.10 (vast IP) |
| Internet adapter | Ethernet0 — DHCP via VMware NAT |

---

## Stap 1 — Netwerk instellen

Voordat Active Directory wordt geïnstalleerd, heeft de domeincontroller een vast (statisch) IP-adres nodig. AD DS en DNS zijn afhankelijk van een stabiel adres.

De VM heeft twee netwerkadapters: één voor internet (NAT, DHCP) en één voor het lab-netwerk (Private to my Mac, vast IP).

### 1.1 Tweede netwerkkaart toevoegen in VMware Fusion

De VM moet uitgeschakeld zijn om een tweede netwerkkaart toe te voegen. Ga naar **VM > Settings** en voeg een nieuwe Network Adapter toe. Stel deze in op **Private to my Mac**.

![VMware Fusion netwerkinstellingen — Private to my Mac](/images/2026-windows-server-2022-ad-dns/vmware-fusion-netwerk-private-to-my-mac.png)
*VMware Fusion netwerkinstellingen: Private to my Mac is het geïsoleerde lab-netwerk*

### 1.2 Statisch IP instellen op Ethernet1

Open **Configuratiescherm > Netwerkverbindingen**. Klik rechts op **Ethernet1 > Properties > Internet Protocol Version 4 (TCP/IPv4) > Properties**.

Vul de volgende waarden in:

- **IP address:** `172.16.37.10`
- **Subnet mask:** `255.255.255.0`
- **Default gateway:** leeg laten
- **Preferred DNS server:** `172.16.37.10` (DC01 wijst naar zichzelf)

![IPv4 Properties — statisch IP instellen](/images/2026-windows-server-2022-ad-dns/ipv4-statisch-ip-instellen.png)
*IPv4 Properties: statisch IP 172.16.37.10 voor het lab-netwerk. Gateway leeg laten — internet loopt via Ethernet0.*

> **Opmerking:** Ethernet0 (internet) blijft op DHCP staan. Alleen Ethernet1 krijgt een vast IP. Zo werkt de VM overal — thuis, op het werk, bij familie — want het interne lab-netwerk is volledig geïsoleerd van het thuisnetwerk.

### 1.3 Verificatie

Open PowerShell en controleer:

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Select-Object InterfaceAlias, IPAddress
```

Verwacht resultaat:

```
Ethernet1        172.16.37.10
Ethernet0        192.168.x.x   (wisselend via DHCP)
```

---

## Stap 2 — AD DS rol installeren via Server Manager

### 2.1 Server Manager openen

Server Manager opent automatisch na het inloggen. Sluit de Windows Admin Center melding.

![Windows Admin Center melding](/images/2026-windows-server-2022-ad-dns/server-manager-admin-center-melding.png)
*Vink "Don't show this message again" aan en sluit dit venster*

![Server Manager Dashboard](/images/2026-windows-server-2022-ad-dns/server-manager-dashboard.png)
*Server Manager Dashboard — het startpunt voor alle serverbeheer*

### 2.2 Rol toevoegen

Klik op **Add roles and features** in het Dashboard.

![Installation Type — Role-based](/images/2026-windows-server-2022-ad-dns/add-roles-installation-type.png)
*Kies Role-based or feature-based installation. DC01 staat al rechtsboven als destination server.*

![Server Selection — DC01](/images/2026-windows-server-2022-ad-dns/add-roles-server-selection.png)
*DC01 is al geselecteerd in de server pool. Klik Next.*

### 2.3 Active Directory Domain Services selecteren

Vink **Active Directory Domain Services** aan. Er verschijnt een popup voor extra benodigde features — klik **Add Features**.

![Server Roles — AD DS selecteren](/images/2026-windows-server-2022-ad-dns/add-roles-server-roles-ad-ds.png)
*Vink Active Directory Domain Services aan in de lijst*

![Features — niets extra selecteren](/images/2026-windows-server-2022-ad-dns/add-roles-features.png)
*Geen extra features nodig. Alles wat benodigd is staat al aangevinkt.*

### 2.4 AD DS informatiepagina

![AD DS informatiepagina](/images/2026-windows-server-2022-ad-dns/ad-ds-informatiepagina.png)
*Informatiepagina over AD DS. Belangrijk: DNS wordt automatisch mee geïnstalleerd.*

### 2.5 Installatie bevestigen

Vink **Restart the destination server automatically if required** aan en klik **Install**.

![Confirmation — installatie overzicht](/images/2026-windows-server-2022-ad-dns/add-roles-confirmation.png)
*Overzicht van alle componenten die worden geïnstalleerd*

### 2.6 Installatie geslaagd

![Installation Results — geslaagd](/images/2026-windows-server-2022-ad-dns/add-roles-installation-geslaagd.png)
*Installation succeeded on DC01. Klik nu op de blauwe link "Promote this server to a domain controller".*

> **Let op:** De AD DS rol is nu geïnstalleerd maar DC01 is nog geen domeincontroller. De link "Promote this server to a domain controller" is de volgende stap.

---

## Stap 3 — Domeincontroller configureren

### 3.1 Deployment Configuration

Kies **Add a new forest** en vul als Root domain name in: `lab.local`

![Deployment Configuration — nieuw forest](/images/2026-windows-server-2022-ad-dns/dc-deployment-configuration-nieuw-forest.png)
*Kies Add a new forest voor een volledig nieuw domein. Domeinnaam: lab.local*

### 3.2 Domain Controller Options

De functional levels staan op **Windows Server 2016** — prima voor een modern lab. DNS server en Global Catalog zijn aangevinkt.

Stel het **DSRM-wachtwoord** in. Dit is een noodwachtwoord voor herstel van Active Directory — bewaar het veilig.

![Domain Controller Options](/images/2026-windows-server-2022-ad-dns/dc-domain-controller-options.png)
*Functional level 2016, DNS Server en Global Catalog aangevinkt. DSRM-wachtwoord invullen.*

### 3.3 DNS Options

Er verschijnt een waarschuwing over DNS-delegatie. Dit is **normaal voor een intern lab-domein** zoals `lab.local` dat niet op het publieke internet bestaat. Laat **Create DNS delegation** uitgevinkt.

![DNS Options — waarschuwing is normaal](/images/2026-windows-server-2022-ad-dns/dc-dns-options.png)
*De waarschuwing over DNS-delegatie is normaal voor een privé lab-domein. Geen actie nodig.*

### 3.4 NetBIOS naam

Windows stelt automatisch de NetBIOS naam in op **LAB**. Wacht tot het veld gevuld is.

![Additional Options — NetBIOS wordt geladen](/images/2026-windows-server-2022-ad-dns/dc-additional-options-netbios-leeg.png)
*Wacht even tot de NetBIOS naam automatisch verschijnt*

![Additional Options — NetBIOS is LAB](/images/2026-windows-server-2022-ad-dns/dc-additional-options-netbios-lab.png)
*NetBIOS naam is LAB — zonder .local extensie. Je logt later in als LAB\Administrator.*

### 3.5 Bestandslocaties

Voor een lab zijn de standaard locaties prima.

![Paths — standaard locaties](/images/2026-windows-server-2022-ad-dns/dc-paths.png)
*Standaard locaties voor AD DS database (NTDS) en SYSVOL. Laat staan.*

### 3.6 Review Options

Controleer de samenvatting:

- Domein: `lab.local`
- NetBIOS: `LAB`
- DNS Server: Yes
- Global Catalog: Yes
- Create DNS Delegation: No

![Review Options — samenvatting](/images/2026-windows-server-2022-ad-dns/dc-review-options.png)
*Samenvatting van de configuratie. Alles klopt — klik Next.*

### 3.7 Prerequisites Check

Het groene vinkje bevestigt dat alle checks geslaagd zijn. De gele waarschuwingen zijn normaal voor een lab.

![Prerequisites Check — geslaagd](/images/2026-windows-server-2022-ad-dns/dc-prerequisites-check-geslaagd.png)
*Groen vinkje: All prerequisite checks passed. Klik Install.*

### 3.8 Installatie

De server configureert DNS en herstart automatisch.

![Installation — DNS wordt geconfigureerd](/images/2026-windows-server-2022-ad-dns/dc-installation-dns-configureren.png)
*DNS Server service wordt geconfigureerd. Na afloop herstart DC01 automatisch.*

> **Na de reboot:** Log in als `LAB\Administrator` in plaats van als lokale Administrator.

---

## Stap 4 — Verificatie na installatie

Open PowerShell als Administrator en controleer:

```powershell
# Domein informatie
Get-ADDomain

# Domeincontroller informatie
Get-ADDomainController

# DNS zones controleren
Get-DnsServerZone

# Naam resolving testen
Resolve-DnsName dc01.lab.local
```

Als `Resolve-DnsName dc01.lab.local` het IP-adres `172.16.37.10` teruggeeft, werkt DNS correct.

---

## Volgende stappen

Nu DC01 functioneert als domeincontroller voor `lab.local`, zijn de volgende stappen:

- **CA01** — Certificate Authority voor interne TLS-certificaten (Jenkins, Harbor, Nexus)
- **Andere VMs joinen aan lab.local** — wijs bij elke nieuwe VM DNS naar `172.16.37.10`
- **Organisational Units en service accounts** aanmaken voor Jenkins, Ansible en Nexus

---
title: "Proxmox Lab — Windows Server 2022 VM aanmaken"
date: 2026-03-31T00:00:00+01:00
description: "Stap voor stap handleiding voor het aanmaken van een Windows Server 2022 virtuele machine in Proxmox VE 9.1.6. Inclusief alle wizard-instellingen, VirtIO drivers en tips uit de praktijk."
categories:
  - article
  - windows
tags:
  - proxmox
  - windows-server-2022
  - virtualisatie
  - vm
  - virtio
  - lab
  - hypervisor
author: "ing. M.A.C.M. (Martijn) van den Boom"
---

Deze handleiding beschrijft het volledige proces voor het aanmaken van een Windows Server 2022 virtuele machine in Proxmox VE 9.1.6. Gebaseerd op praktijkervaring inclusief alle correcties en geleerde lessen tijdens de opbouw van een thuislab.

> 📄 **Download de volledige handleiding met screenshots:**
> [WS2022-in-Proxmox-VM-Creation-Guide.docx](/documents/WS2022-in-Proxmox-VM-Creation-Guide.docx)

---

## Omgeving

| Onderdeel | Details |
|-----------|---------|
| Proxmox Host | macpro2013.local — Mac Pro 2013 Trashcan |
| Proxmox Versie | 9.1.6 |
| RAM | 128 GB |
| Opslag | 3.6 TB NVMe (local-lvm pool) |
| Netwerkbrug | vmbr0 — intern lab netwerk (192.168.178.x) |
| Proxmox WebUI | https://192.168.178.205:8006 |

> **Let op:** De Proxmox WebUI toont een SSL-certificaatwaarschuwing omdat Proxmox standaard een zelfondertekend certificaat gebruikt. Dit is de aanleiding voor het later opzetten van een interne Certificate Authority (CA).

---

## Vereisten

Zorg ervoor dat de volgende ISO-images zijn geüpload naar de Proxmox lokale opslag (**Proxmox WebUI → local → ISO Images**) voordat je een VM aanmaakt:

- **Windows Server 2022 Evaluation:** `Windows_2022_SERVER_EVAL_x64FRE_en-us.iso`
- **VirtIO Drivers:** `virtio-win-0.1.285.iso` (of nieuwer)

> **Waarschuwing:** Beide ISO's zijn verplicht. Zonder de VirtIO ISO kan Windows Setup de schijf en netwerkadapter niet detecteren.

---

## Naamgevingsconventie

Gebruik consistente namen voor alle lab-VM's zodat je in één oogopslag ziet wat elke VM doet in het Proxmox-paneel.

| Patroon | Voorbeeld | Beschrijving |
|---------|-----------|--------------|
| WS2022-LAB{nn}-{ROLLEN} | WS2022-LAB01-AD-DNS | Lab VM — nummer + alle actieve rollen |
| WS2022-LAB{nn}-CA | WS2022-LAB02-CA | Certificate Authority VM |
| WS2022-TEMPLATE-{NAAM} | WS2022-TEMPLATE-BASE | Template VM — gebruik VM ID 900+ |

Een VM hernoemen via de Proxmox hostshell (de Proxmox GUI heeft geen hernoemoptie):

```bash
ssh root@macpro2013.local
qm set <VMID> --name <NIEUWE-NAAM>
# Voorbeeld — hernoem VM 100:
qm set 100 --name WS2022-LAB01-AD-DNS
```

---

## Stap 1 — VM aanmaken via de Proxmox Wizard

Klik in de Proxmox WebUI op **Create VM** (blauwe knop rechtsboven). Doorloop elk tabblad in de volgorde zoals hieronder beschreven.

### 1.1 Tabblad General

| Instelling | Waarde | Toelichting |
|------------|--------|-------------|
| Name | WS2022-TEMPLATE-BASE | Beschrijvende naam met OS + rol |
| VM ID | 900 | Gebruik 900+ voor templates, 100+ voor lab-VM's |
| Node | macpro2013 | Jouw Proxmox hostknooppunt |

### 1.2 Tabblad OS

| Instelling | Waarde | Toelichting |
|------------|--------|-------------|
| ISO Image | Windows_2022_SERVER_EVAL_x64FRE_en-us.iso | Selecteer uit lokale opslag |
| Type | Microsoft Windows | Moet expliciet worden ingesteld |
| Version | 11/2022/2025 | Moet expliciet worden ingesteld |
| Add VirtIO drivers ISO | Ingeschakeld (vinkje) | Voegt een tweede cd-schijf toe |
| VirtIO ISO | virtio-win-0.1.285.iso | Selecteer uit lokale opslag |

> **Waarschuwing:** Het OS-type en de versie moeten handmatig worden ingesteld. Het vinkje voor de extra VirtIO ISO voegt een tweede cd-station toe — dit is essentieel voor het laden van opslag- en netwerkdrivers tijdens Windows Setup.

### 1.3 Tabblad System

| Instelling | Waarde | Toelichting |
|------------|--------|-------------|
| BIOS | OVMF (UEFI) | Vereist voor Windows Server 2022 |
| Machine | pc-q35 | Moderne chipset vereist voor TPM 2.0 |
| SCSI Controller | VirtIO SCSI single | Beste opslagprestaties |
| EFI Storage | local-lvm | Moet expliciet worden geselecteerd |
| TPM Storage | local-lvm | Moet expliciet worden geselecteerd |
| TPM Version | v2.0 | Vereist voor Windows Server 2022 |

> **Waarschuwing:** EFI Storage en TPM Storage hebben geen standaardwaarde — beide moeten expliciet worden geselecteerd. Zonder deze instellingen start de VM niet correct op.

### 1.4 Tabblad Disks

| Instelling | Waarde | Toelichting |
|------------|--------|-------------|
| Bus/Device | SCSI | Gebruik met VirtIO SCSI controller |
| Storage | local-lvm | NVMe-backed pool |
| Disk Size | 60 GB | Voldoende voor OS, rollen en tools |
| Cache | Write back | Beste prestaties op NVMe |
| Discard | Ingeschakeld | Maakt TRIM mogelijk voor SSD/NVMe |
| IO Thread | Ingeschakeld | Verbetert schijfdoorvoer |

### 1.5 Tabblad CPU

| Instelling | Waarde | Toelichting |
|------------|--------|-------------|
| Sockets | 1 | Enkele socket |
| Cores | 2 | Voldoende voor alle lab-VM-rollen |
| Type | host | Geeft de daadwerkelijke host-CPU door — betere prestaties dan kvm64 |

> **Waarschuwing:** Het CPU-type moet worden ingesteld op **host**. De standaard kvm64 beperkt de beschikbare CPU-instructiesets en vermindert de prestaties.

### 1.6 Tabblad Memory

| Instelling | Waarde | Toelichting |
|------------|--------|-------------|
| Memory | 4096 MB | 4 GB per VM |
| Minimum Memory | 4096 MB | Gelijk stellen aan Memory om ballooning uit te schakelen |
| Ballooning Device | Uitgeschakeld | Wordt slecht ondersteund op Windows |

> **Waarschuwing:** Ballooning moet worden uitgeschakeld voor Windows-VM's. Stel Minimum Memory gelijk aan Memory om dit af te dwingen.

### 1.7 Tabblad Network

| Instelling | Waarde | Toelichting |
|------------|--------|-------------|
| Bridge | vmbr0 | Intern lab netwerk |
| Model | VirtIO (paravirtualized) | Beste prestaties — vereist VirtIO-drivers |
| Firewall | Ingeschakeld (standaard laten) | Laat ingeschakeld — weerspiegelt productieomgevingen |

> **Tip:** Laat de Proxmox-firewall ingeschakeld op de netwerkadapter. Door de firewall in te laten staan oefen je met het oplossen van problemen zoals in een echte productieomgeving.

---

## Stap 2 — Hardware verifiëren voor het opstarten

Klik na het afronden van de wizard **niet** direct op Start. Controleer eerst de hardwareconfiguratie via **Hardware** in het linker paneel. Verifieer het volgende:

- **Memory:** 4.00 GiB [balloon=0] — balloon=0 bevestigt dat ballooning is uitgeschakeld
- **Processors:** 2 (1 socket, 2 cores) [host] — bevestigt host CPU-type
- **BIOS:** OVMF (UEFI)
- **Machine:** pc-q35-10.1
- **SCSI Controller:** VirtIO SCSI single
- **CD/DVD ide0:** VirtIO ISO
- **CD/DVD ide2:** Windows 2022 ISO
- **Hard Disk:** 60 GB, cache=writeback, discard=on, iothread=1
- **Network:** vmbr0, firewall=1
- **EFI Disk** en **TPM State** aanwezig op local-lvm

---

## Stap 3 — VM opstarten en Windows installeren

Klik op **Start** en open direct de **Console**. Wanneer je het volgende bericht ziet, klik dan eerst in het consolevenster (om toetsenbordfocus te krijgen) en druk op een willekeurige toets:

```
Press any key to boot from CD or DVD......
```

> **Waarschuwing:** Als je deze prompt mist, probeert de VM op te starten via PXE-boot. Reset de VM en probeer het opnieuw — wees klaar bij de console voordat je op Start klikt.

Wanneer de prompt op tijd wordt gevangen, verschijnt de **Windows Boot Manager**. Selecteer **Windows Setup [EMS Enabled]** en druk op Enter.

---

## Stap 4 — Editieselectie

Wanneer gevraagd om een editie te selecteren, kies:

**Windows Server 2022 Datacenter (Desktop Experience)**

> **Waarschuwing:** Zorg ervoor dat je **Datacenter** selecteert — niet Standard. En **Desktop Experience** — niet Core. Core heeft geen GUI, wat het ongeschikt maakt voor dit lab-template.

---

## Stap 5 — VirtIO Opslagdriver laden

Op het scherm 'Where do you want to install the operating system?' is de schijflijst leeg. Dit is normaal — Windows kan de VirtIO SCSI-schijf niet zien zonder de driver.

Volg deze stappen om de driver te laden:

1. Klik op **Load driver**
2. Klik op **Browse**
3. Navigeer naar het VirtIO cd-station (D: of E:)
4. Open de map: `vioscsi \ w2k22 \ amd64`
5. Klik op **OK**
6. Selecteer **Red Hat VirtIO SCSI pass-through controller**
7. Klik op **Next**

De 60 GB-schijf verschijnt nu in de lijst. Selecteer deze en ga verder. De Windows-installatie begint.

---

## Stap 6 — Na de installatie

Na de installatie en herstart land je op het **Server Manager Dashboard**. Sluit de Windows Admin Center-pop-up (vink *Don't show this message again* aan).

De VM is nu klaar voor de volgende stap: het voorbereiden als herbruikbaar Proxmox-template. Raadpleeg hiervoor de begeleidende handleiding:

> 📄 **[Proxmox Lab — Windows Server 2022 Template voorbereiding](/blog/2026-proxmox-windows-server-2022-template-voorbereiding/)**

---

## Samenvatting checklist

1. Windows Server 2022 ISO uploaden naar Proxmox lokale opslag ☐
2. VirtIO drivers ISO uploaden naar Proxmox lokale opslag ☐
3. VM aanmaken met de juiste instellingen in alle wizard-tabbladen ☐
4. Hardwareconfiguratie verifiëren in het Proxmox Hardware-tabblad vóór het opstarten ☐
5. VM opstarten — CD-bootprompt direct in de Console opvangen ☐
6. Windows Server 2022 Datacenter (Desktop Experience) selecteren ☐
7. VirtIO SCSI-driver laden (vioscsi/w2k22/amd64) vóór schijfselectie ☐
8. Windows-installatie voltooien ☐
9. Verder gaan naar de Template Preparation-handleiding ☐

---

> 📄 **Download de volledige handleiding met screenshots:**
> [WS2022-in-Proxmox-VM-Creation-Guide.docx](/documents/WS2022-in-Proxmox-VM-Creation-Guide.docx)

Vriendelijke groeten,

Martijn

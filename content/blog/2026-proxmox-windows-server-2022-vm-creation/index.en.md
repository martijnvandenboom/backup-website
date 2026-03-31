---
title: "Proxmox Lab — Creating a Windows Server 2022 VM"
date: 2026-03-31T00:00:00+01:00
description: "Step-by-step guide for creating a Windows Server 2022 virtual machine in Proxmox VE 9.1.6. Covers all wizard settings, VirtIO drivers, and real-world tips from actual lab experience."
categories:
  - article
  - windows
tags:
  - proxmox
  - windows-server-2022
  - virtualisation
  - vm
  - virtio
  - lab
  - hypervisor
author: "ing. M.A.C.M. (Martijn) van den Boom"
---

This guide documents the complete process of creating a Windows Server 2022 virtual machine in Proxmox VE 9.1.6. It is based on actual lab setup experience and includes all corrections and lessons learned during the build of a home lab.

> 📄 **Download the full guide with screenshots:**
> [WS2022-in-Proxmox-VM-Creation-Guide.docx](/documents/WS2022-in-Proxmox-VM-Creation-Guide.docx)

---

## Environment

| Component | Details |
|-----------|---------|
| Proxmox Host | macpro2013.local — Mac Pro 2013 Trashcan |
| Proxmox Version | 9.1.6 |
| RAM | 128 GB |
| Storage | 3.6 TB NVMe (local-lvm pool) |
| Network Bridge | vmbr0 — internal lab network (192.168.178.x) |
| Proxmox WebUI | https://192.168.178.205:8006 |

> **Note:** The Proxmox WebUI shows an SSL certificate warning because Proxmox uses a self-signed certificate by default. This is the motivation for setting up an internal Certificate Authority (CA) later — once the CA is in place, a proper trusted certificate can be issued for Proxmox.

![Safari SSL warning for macpro2013.local](/blog/2026-proxmox-windows-server-2022-vm-aanmaken/proxmox-ssl-warning.png)
*Safari shows an SSL warning for macpro2013.local. This disappears once your internal CA is in place and Proxmox uses a trusted certificate.*

---

## Prerequisites

Before creating a VM, ensure the following ISO images are uploaded to Proxmox local storage (**Proxmox WebUI → local → ISO Images**):

- **Windows Server 2022 Evaluation:** `Windows_2022_SERVER_EVAL_x64FRE_en-us.iso`
- **VirtIO Drivers:** `virtio-win-0.1.285.iso` (or newer)

> **Warning:** Both ISOs are required. Without the VirtIO ISO, Windows Setup cannot detect the disk and network adapter.

---

## Naming Convention

Use consistent naming for all lab VMs so you can see what each VM does at a glance in the Proxmox panel.

| Pattern | Example | Description |
|---------|---------|-------------|
| WS2022-LAB{nn}-{ROLES} | WS2022-LAB01-AD-DNS | Lab VM — number + all active roles |
| WS2022-LAB{nn}-CA | WS2022-LAB02-CA | Certificate Authority VM |
| WS2022-TEMPLATE-{NAME} | WS2022-TEMPLATE-BASE | Template VM — use VM ID 900+ |

To rename a VM via the Proxmox host shell (the Proxmox GUI has no rename option):

```bash
ssh root@macpro2013.local
qm set <VMID> --name <NEW-NAME>
# Example — rename VM 100:
qm set 100 --name WS2022-LAB01-AD-DNS
```

![Proxmox overview with both VMs correctly named](/blog/2026-proxmox-windows-server-2022-vm-aanmaken/proxmox-overview-both-vms.png)
*The Proxmox side panel after both VMs were created and renamed: WS2022-LAB01-AD-DNS as VM 100 and WS2022-TEMPLATE-BASE as VM 900.*

---

## Step 1 — Create the VM via the Proxmox Wizard

In the Proxmox WebUI, click **Create VM** (blue button, top right). Work through each tab in order as described below.

### 1.1 General Tab

| Setting | Value | Notes |
|---------|-------|-------|
| Name | WS2022-TEMPLATE-BASE | Descriptive name including OS + role |
| VM ID | 900 | Use 900+ for templates, 100+ for lab VMs |
| Node | macpro2013 | Your Proxmox host node |

### 1.2 OS Tab

| Setting | Value | Notes |
|---------|-------|-------|
| ISO Image | Windows_2022_SERVER_EVAL_x64FRE_en-us.iso | Select from local storage |
| Type | Microsoft Windows | Must be set explicitly |
| Version | 11/2022/2025 | Must be set explicitly |
| Add VirtIO drivers ISO | Enabled (checkbox) | Adds a second CD drive for VirtIO ISO |
| VirtIO ISO | virtio-win-0.1.285.iso | Select from local storage |

> **Warning:** The OS Type and Version must both be set manually. The additional VirtIO ISO checkbox adds a second CD drive — this is essential for loading storage and network drivers during Windows Setup.

### 1.3 System Tab

| Setting | Value | Notes |
|---------|-------|-------|
| BIOS | OVMF (UEFI) | Required for Windows Server 2022 |
| Machine | pc-q35 | Modern chipset required for TPM 2.0 |
| SCSI Controller | VirtIO SCSI single | Best storage performance |
| EFI Storage | local-lvm | Must be explicitly selected — no default |
| TPM Storage | local-lvm | Must be explicitly selected — no default |
| TPM Version | v2.0 | Required for Windows Server 2022 |

> **Warning:** EFI Storage and TPM Storage have no default — both must be explicitly selected. Without them the VM will not boot correctly.

### 1.4 Disks Tab

| Setting | Value | Notes |
|---------|-------|-------|
| Bus/Device | SCSI | Use with VirtIO SCSI controller |
| Storage | local-lvm | NVMe-backed pool |
| Disk Size | 60 GB | Sufficient for OS, roles and tools |
| Cache | Write back | Best performance on NVMe |
| Discard | Enabled | Enables TRIM for SSD/NVMe storage |
| IO Thread | Enabled | Improves disk throughput |

### 1.5 CPU Tab

| Setting | Value | Notes |
|---------|-------|-------|
| Sockets | 1 | Single socket |
| Cores | 2 | Sufficient for all lab VM roles |
| Type | host | Passes through actual host CPU — better performance than kvm64 |

> **Warning:** CPU Type must be set to **host**. The default kvm64 limits available CPU instruction sets and reduces performance.

### 1.6 Memory Tab

| Setting | Value | Notes |
|---------|-------|-------|
| Memory | 4096 MB | 4 GB per VM |
| Minimum Memory | 4096 MB | Set identical to Memory to disable ballooning |
| Ballooning Device | Disabled | Not well supported on Windows |

> **Warning:** Ballooning must be disabled for Windows VMs. Set Minimum Memory equal to Memory to enforce this.

### 1.7 Network Tab

| Setting | Value | Notes |
|---------|-------|-------|
| Bridge | vmbr0 | Internal lab network |
| Model | VirtIO (paravirtualized) | Best performance — requires VirtIO drivers |
| Firewall | Enabled (leave default) | Keep enabled — mirrors production environments |

> **Tip:** Leave the Proxmox firewall enabled on the network adapter. Troubleshooting through the firewall builds valuable skills that mirror real production environments.

---

## Step 2 — Verify Hardware Before Booting

After clicking Finish, do **not** start the VM immediately. First verify the hardware config by clicking the VM in the left panel and selecting **Hardware**. Confirm all of the following:

![Proxmox Hardware tab for VM 900](/blog/2026-proxmox-windows-server-2022-vm-aanmaken/proxmox-vm900-hardware.png)
*VM 900 shown in the Hardware tab with the intended template configuration, including `balloon=0`, `host` CPU type, EFI disk, TPM state, both ISOs, and the 60 GB VirtIO-backed disk.*

- **Memory:** 4.00 GiB [balloon=0] — balloon=0 confirms ballooning is disabled
- **Processors:** 2 (1 socket, 2 cores) [host] — confirms host CPU type
- **BIOS:** OVMF (UEFI)
- **Machine:** pc-q35-10.1
- **SCSI Controller:** VirtIO SCSI single
- **CD/DVD ide0:** VirtIO ISO
- **CD/DVD ide2:** Windows 2022 ISO
- **Hard Disk:** 60 GB, cache=writeback, discard=on, iothread=1
- **Network:** vmbr0, firewall=1
- **EFI Disk** and **TPM State** present on local-lvm

If you already created your first lab VM as well, the hardware view should look similar there too:

![Proxmox Hardware tab for VM 100](/blog/2026-proxmox-windows-server-2022-vm-aanmaken/proxmox-vm100-hardware.png)
*VM 100 hardware overview after creation. The exact role name differs, but the main VM settings remain the same.*

---

## Step 3 — Start the VM and Install Windows

Click **Start** and immediately open the **Console**. When you see the following message, click inside the console window first (to capture keyboard focus) and press any key:

```
Press any key to boot from CD or DVD......
```

> **Warning:** If you miss this prompt, the VM falls through to PXE boot. Simply reset the VM and try again — be ready at the console before clicking Start.

![PXE boot fallback when the CD boot prompt is missed](/blog/2026-proxmox-windows-server-2022-vm-aanmaken/proxmox-boot-pxe.png)
*If you do not press a key in time, the VM falls through to PXE boot. Reset the VM and try again.*

When you catch the prompt in time, the **Windows Boot Manager** appears. Select **Windows Setup [EMS Enabled]** and press Enter to continue.

![Windows Boot Manager](/blog/2026-proxmox-windows-server-2022-vm-aanmaken/windows-boot-manager.png)
*Windows Boot Manager with Windows Setup selected.*

---

## Step 4 — Edition Selection

When prompted to select an edition, choose:

**Windows Server 2022 Datacenter (Desktop Experience)**

> **Warning:** Make sure to select **Datacenter** — not Standard. And **Desktop Experience** — not Core. Core has no GUI which makes it unsuitable for this lab template.

---

## Step 5 — Loading the VirtIO Storage Driver

On the *Where do you want to install the operating system?* screen, the disk list will be empty. This is expected — Windows cannot see the VirtIO SCSI disk without the driver.

![Windows Setup with no disk visible yet](/blog/2026-proxmox-windows-server-2022-vm-aanmaken/windows-no-disk.png)
*This is the normal empty-disk screen before the VirtIO SCSI driver is loaded.*

Follow these steps to load the driver:

1. Click **Load driver**
2. Click **Browse**
3. Navigate to the VirtIO CD drive (D: or E:)
4. Open the folder: `vioscsi \ w2k22 \ amd64`
5. Click **OK**
6. Select **Red Hat VirtIO SCSI pass-through controller**
7. Click **Next**

The 60 GB disk will now appear in the list. Select it and continue. Windows installation begins.

![Windows Server 2022 installation in progress](/blog/2026-proxmox-windows-server-2022-vm-aanmaken/windows-installing.png)
*Windows Setup after the storage driver is loaded and installation has started.*

---

## Step 6 — After Installation

After Windows installs and reboots, you will land at the **Server Manager Dashboard**. Close the Windows Admin Center popup (tick *Don't show this message again*).

![Server Manager Dashboard after Windows Server 2022 installation](/blog/2026-proxmox-windows-server-2022-vm-aanmaken/windows-server-manager.png)
*Server Manager shown after the first successful boot of Windows Server 2022 Datacenter.*

The VM is now ready for the next step: preparing it as a reusable Proxmox template. Refer to the companion guide:

> 📄 **[Proxmox Lab — Windows Server 2022 Template Preparation](/blog/2026-proxmox-windows-server-2022-template-preparation/)**

---

## Summary Checklist

1. Upload Windows Server 2022 ISO to Proxmox local storage ☐
2. Upload VirtIO drivers ISO to Proxmox local storage ☐
3. Create VM with correct settings across all wizard tabs ☐
4. Verify hardware config in Proxmox Hardware tab before booting ☐
5. Boot VM — catch CD boot prompt immediately in Console ☐
6. Select Windows Server 2022 Datacenter (Desktop Experience) ☐
7. Load VirtIO SCSI driver (vioscsi/w2k22/amd64) before disk selection ☐
8. Complete Windows installation ☐
9. Proceed to the Template Preparation guide ☐

---

> 📄 **Download the full guide with screenshots:**
> [WS2022-in-Proxmox-VM-Creation-Guide.docx](/documents/WS2022-in-Proxmox-VM-Creation-Guide.docx)

Best regards,

Martijn

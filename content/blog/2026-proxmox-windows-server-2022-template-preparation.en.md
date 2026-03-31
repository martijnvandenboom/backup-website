---
title: "Proxmox Lab — Windows Server 2022 Template Preparation"
date: 2026-03-31T00:00:00+01:00
description: "From first boot to Sysprep — step-by-step guide for preparing a Windows Server 2022 VM as a reusable Proxmox template. Covers VirtIO drivers, Windows Update via PowerShell, performance tweaks, and Sysprep."
categories:
  - article
  - windows
tags:
  - proxmox
  - windows-server-2022
  - sysprep
  - virtio
  - powershell
  - template
  - lab
  - hypervisor
author: "ing. M.A.C.M. (Martijn) van den Boom"
---

This guide covers the complete process of preparing a freshly installed Windows Server 2022 VM as a reusable Proxmox template. All future VMs (CA server, member servers, etc.) are cloned from this template, saving significant time and ensuring a consistent baseline across the entire lab.

> 📄 **Download the full guide with screenshots:**
> [WS2022-in-Proxmox-Template-Preparation-Guide.docx](/documents/WS2022-in-Proxmox-Template-Preparation-Guide.docx)

---

## Overview

The full process consists of these steps:

1. Install VirtIO guest drivers
2. Run Windows Update — fully patch the OS
3. Apply performance tweaks
4. Basic housekeeping — timezone, RDP, IE Enhanced Security
5. Sysprep — generalize and shut down
6. Convert to template in Proxmox

> **Warning:** Never boot the VM after Sysprep. If you do, the generalization is consumed and the template must be rebuilt from scratch.

---

## Step 1 — Install VirtIO Guest Drivers

VirtIO guest drivers are required for Windows to function correctly on Proxmox. They cover the storage controller, network adapter, memory balloon, display, and other paravirtualized devices.

Open **File Explorer** inside the Windows VM and navigate to the VirtIO CD drive (D: or E:). Scroll to the bottom of the file list and double-click **virtio-win-guest-tools.exe** (the Application file, approximately 30 MB). This single installer handles all required drivers in one pass. Accept the defaults and let it complete.

> **Tip:** Always use `virtio-win-guest-tools.exe` rather than installing individual drivers from the subfolders. It is faster and ensures nothing is missed.

---

## Step 2 — Windows Update

Fully patching the OS before Sysprep means every cloned VM starts up-to-date without needing to run updates individually.

### 2.1 Starting Windows Update

Open **Settings → Update & Security → Windows Update** and click **Check for updates**. Available updates will begin downloading and installing.

### 2.2 Windows Update GUI Hangs — Known Issue

The Windows Update GUI in Server 2022 VMs is unreliable. Buttons frequently stop responding and downloads appear to hang. This is a known issue in VM environments.

> **Warning:** When the Windows Update GUI hangs, do NOT attempt to fix it through the GUI. Switch to the PowerShell method described below.

### 2.3 Preferred Method — PSWindowsUpdate via PowerShell

Open **PowerShell as Administrator** (right-click Start → Windows PowerShell (Admin)):

**Step 1 — Install the PSWindowsUpdate module:**

```powershell
Install-Module PSWindowsUpdate -Force -Confirm:$false
```

Type `Y` and press Enter when prompted to install the NuGet provider or trust PSGallery.

**Step 2 — Import the module and run all updates:**

```powershell
Import-Module PSWindowsUpdate
Get-WindowsUpdate -Install -AcceptAll -AutoReboot
```

The VM will reboot automatically if required. After reboot, log back in and run the command again until no updates remain:

```powershell
Get-WindowsUpdate -Install -AcceptAll -AutoReboot
```

Run Windows Update a second time to confirm nothing was missed. Some updates only become available after others are installed.

> **Tip:** Some updates (such as KB890830 — Windows Malicious Software Removal Tool) may persistently fail in VM environments. This is known and harmless — it does not affect server functionality and can be safely skipped.

---

## Step 3 — Performance Tweaks

Apply these tweaks in PowerShell (Admin) before Sysprep so every cloned VM benefits automatically:

```powershell
# High Performance power plan
powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c

# Disable Windows Search indexing — not needed on servers
Set-Service WSearch -StartupType Disabled
Stop-Service WSearch -Force

# Disable SysMain / Superfetch — not beneficial in VMs
Set-Service SysMain -StartupType Disabled
Stop-Service SysMain -Force
```

> **Tip:** Also change the VM Display from **Default** to **VirtIO-GPU** in the Proxmox Hardware tab. This significantly improves console responsiveness.

---

## Step 4 — Basic Housekeeping

Run these commands in PowerShell (Admin):

```powershell
# Set timezone to Amsterdam
Set-TimeZone -Name "W. Europe Standard Time"

# Enable RDP
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections" -Value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"

# Disable NLA for easier lab access
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name "UserAuthentication" -Value 0

# Disable IE Enhanced Security Configuration
$AdminKey = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A7-37EF-4b3f-8CFC-4F3A74704073}"
$UserKey  = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A8-37EF-4b3f-8CFC-4F3A74704073}"
Set-ItemProperty -Path $AdminKey -Name "IsInstalled" -Value 0
Set-ItemProperty -Path $UserKey  -Name "IsInstalled" -Value 0
```

> **Warning:** After enabling RDP via registry, a reboot is required before port 3389 starts listening. Run `Restart-Computer` and wait for the VM to come back up.

### 4.1 Verifying RDP Connectivity

After rebooting, verify RDP is working from the Proxmox host shell:

```bash
ping 192.168.178.11           # Responds with 0% packet loss
nc -zv 192.168.178.11 3389    # Port open confirms RDP is listening
```

> **Tip:** If `nc` shows *Connection refused* after enabling RDP, a reboot is needed. RDP does not start listening until after a restart.

---

## Step 5 — Sysprep

Sysprep generalizes the installation by removing all machine-specific identifiers including the Security Identifier (SID), computer name, and hardware references. This is essential — without it, every cloned VM would share the same SID causing Active Directory conflicts.

> **Warning:** This is the point of no return. After Sysprep shuts down the VM, do **NOT** boot it again. Immediately go to Proxmox and convert it to a template.

Run in PowerShell (Admin) or Command Prompt:

```powershell
C:\Windows\System32\Sysprep\sysprep.exe /oobe /generalize /shutdown
```

Flag purposes:

| Flag | Purpose |
|------|---------|
| /generalize | Removes unique system identifiers — SID, computer name, hardware IDs |
| /oobe | Sets Windows to run first-time setup on next boot |
| /shutdown | Shuts down the VM automatically when complete |

Sysprep takes approximately 2–5 minutes. The VM shuts itself down when complete.

---

## Step 6 — Convert to Template in Proxmox

Once the VM has shut itself down after Sysprep, in the Proxmox left panel:

1. Right-click on the VM (e.g. **900 WS2022-TEMPLATE-BASE**)
2. Select **Convert to template**
3. Confirm the action

The VM icon changes to a template icon. It can no longer be started directly — only cloned.

---

## Step 7 — Cloning the Template for New VMs

To create a new VM from the template:

1. Right-click the template in the Proxmox left panel
2. Select **Clone**
3. Set **Mode** to **Full Clone** — not Linked Clone
4. Enter the new VM name following the naming convention (e.g. WS2022-LAB02-CA)
5. Set the VM ID
6. Click **Clone**

> **Warning:** Always use **Full Clone**. Linked clones depend on the template disk and cannot function independently. Full clones are completely self-contained VMs.

After cloning, the new VM boots into Windows OOBE (first-time setup) where you configure the Administrator password, computer name, and network settings before joining the domain.

---

## Summary Checklist

1. Install virtio-win-guest-tools.exe from VirtIO CD drive ☐
2. Run PSWindowsUpdate until fully patched — repeat after each reboot ☐
3. Set High Performance power plan via powercfg ☐
4. Disable WSearch and SysMain services ☐
5. Change Proxmox Display to VirtIO-GPU in Hardware tab ☐
6. Set timezone to W. Europe Standard Time ☐
7. Enable RDP and disable NLA ☐
8. Disable IE Enhanced Security Configuration ☐
9. Reboot and verify RDP on port 3389 via nc ☐
10. Run Sysprep /oobe /generalize /shutdown ☐
11. Convert VM to template in Proxmox immediately after shutdown ☐

---

> 📄 **Download the full guide with screenshots:**
> [WS2022-in-Proxmox-Template-Preparation-Guide.docx](/documents/WS2022-in-Proxmox-Template-Preparation-Guide.docx)

Best regards,

Martijn

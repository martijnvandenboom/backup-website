---
title: "Windows Server 2022 Home Lab — AD DS, DNS, CA and Secured RDP"
date: 2026-04-02
author: "ing. M.A.C.M. (Martijn) van den Boom"
description: "Complete step-by-step guide to building a Windows Server 2022 home lab in Proxmox: Active Directory, DNS, Certificate Authority, Group Policy and secured RDP connections from macOS."
categories:
  - windows
tags:
  - windows-server-2022
  - proxmox
  - active-directory
  - dns
  - certificate-authority
  - pki
  - group-policy
  - rdp
  - powershell
  - lab
  - devops
  - security
---

This article describes the full setup of a two-server Windows Server 2022 home lab in Proxmox VE. Together the two virtual machines provide Active Directory Domain Services, DNS, Group Policy and a Certificate Authority (ADCS). RDP connections are secured with PKI certificates so that the Mac Mini M1 management workstation connects without certificate warnings.

This is part 3 of the series on building a Windows DevOps lab in Proxmox. In [part 1](https://vandenboom.icu/blog/2026-proxmox-windows-server-2022-vm-creation/) I described how to create a VM, and in [part 2](https://vandenboom.icu/blog/2026-proxmox-windows-server-2022-template-preparation/) how to prepare the template.

> **Download the complete manual as a Word document (.docx):**
> [WS2022-Lab-Manual-EN.docx](https://vandenboom.icu/blog/2026-windows-server-2022-home-lab-ad-dns-ca-rdp/WS2022-Lab-Manual-EN.docx)

---

## Lab Environment

| Component | Value |
|---|---|
| Proxmox host | macpro2013.local |
| Proxmox console | https://macpro2013.local:8006 |
| Management workstation | Mac Mini M1 |
| VM 1 — AD + DNS | WS2022-AD-DNS — 192.168.178.210 |
| VM 2 — CA | WS2022-CA01 — 192.168.178.211 |
| Default gateway | 192.168.178.1 |
| Subnet prefix | /24 |
| Domain | LAB01.local |
| Resources (both VMs) | 2 vCPU / 4 GB RAM |
| Template | WS2022-TEMPLATE-BASE |

---

## Build Order

The CA has a hard dependency on a working AD and DNS. Always build in this order:

1. Clone `WS2022-TEMPLATE-BASE` to `WS2022-AD-DNS` and configure hostname and static IP
2. Install AD DS + DNS and promote to Domain Controller
3. Configure DNS zones, SYSVOL scripts folder and Group Policy
4. Clone `WS2022-TEMPLATE-BASE` to `WS2022-CA01` and join the domain
5. Install ADCS (Enterprise Root CA), Web Enrollment and IIS
6. Configure certificate templates and CRL distribution points
7. Deploy `Set-RDPCert.ps1` via SYSVOL and Scheduled Task on both servers
8. Trust the Root CA certificate on the Mac Mini M1

---

## Step 1 — Clone and prepare WS2022-AD-DNS

Clone `WS2022-TEMPLATE-BASE` to `WS2022-AD-DNS` via the Proxmox console. Set 2 vCPU and 4 GB RAM and attach the VM to the lab bridge.

After booting, log in as local Administrator and run the following in an elevated PowerShell session:

```powershell
# RUN ON: WS2022-AD-DNS (192.168.178.210) — Elevated PowerShell

# Rename the computer
Rename-Computer -NewName "WS2022-AD-DNS" -Force

# Identify the active network adapter
$adapter = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object -First 1

# Remove any existing DHCP configuration
Remove-NetIPAddress -InterfaceIndex $adapter.ifIndex -Confirm:$false -ErrorAction SilentlyContinue
Remove-NetRoute     -InterfaceIndex $adapter.ifIndex -Confirm:$false -ErrorAction SilentlyContinue

# Assign a static IP address
New-NetIPAddress `
    -InterfaceIndex  $adapter.ifIndex `
    -IPAddress       192.168.178.210 `
    -PrefixLength    24 `
    -DefaultGateway  192.168.178.1

# Point DNS to loopback — after AD DS installation point to own IP
Set-DnsClientServerAddress `
    -InterfaceIndex  $adapter.ifIndex `
    -ServerAddresses 127.0.0.1

# Restart to apply the hostname
Restart-Computer -Force
```

---

## Step 2 — Install AD DS and DNS

After the restart, log in as local Administrator and run:

```powershell
# RUN ON: WS2022-AD-DNS (192.168.178.210) — Elevated PowerShell

# Install AD DS and DNS with all management tools
Install-WindowsFeature `
    -Name AD-Domain-Services, DNS `
    -IncludeManagementTools `
    -IncludeAllSubFeature

# Promote to Domain Controller and create the new forest
Import-Module ADDSDeployment

Install-ADDSForest `
    -DomainName                    "LAB01.local" `
    -DomainNetBiosName             "LAB01" `
    -ForestMode                    "WinThreshold" `
    -DomainMode                    "WinThreshold" `
    -InstallDns                    $true `
    -DatabasePath                  "C:\Windows\NTDS" `
    -LogPath                       "C:\Windows\NTDS" `
    -SysvolPath                    "C:\Windows\SYSVOL" `
    -SafeModeAdministratorPassword (ConvertTo-SecureString "P@ssw0rd!DSRM2026" -AsPlainText -Force) `
    -Force
```

The server restarts automatically. Afterwards, log in as `LAB01\Administrator`.

After the restart: update the DNS pointer and create the reverse lookup zone:

```powershell
# RUN ON: WS2022-AD-DNS (192.168.178.210) — Elevated PowerShell

# Update DNS pointer to own IP
$adapter = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object -First 1
Set-DnsClientServerAddress `
    -InterfaceIndex  $adapter.ifIndex `
    -ServerAddresses 192.168.178.210, 8.8.8.8

# Create reverse lookup zone
Add-DnsServerPrimaryZone `
    -NetworkID        "192.168.178.0/24" `
    -ReplicationScope "Forest"

# Add PTR record for the AD server
Add-DnsServerResourceRecordPtr `
    -ZoneName      "178.168.192.in-addr.arpa" `
    -Name          "210" `
    -PtrDomainName "WS2022-AD-DNS.LAB01.local."

# Create the SYSVOL scripts folder
$scriptShare = "\\LAB01.local\SYSVOL\LAB01.local\scripts"
If (-Not (Test-Path $scriptShare)) {
    New-Item -ItemType Directory -Path $scriptShare -Force
}
```

---

## Step 3 — Configure Group Policy

```powershell
# RUN ON: WS2022-AD-DNS (192.168.178.210) — Elevated PowerShell

Import-Module GroupPolicy

# Create the GPO and link to the domain root
$gpo = New-GPO -Name "LAB01-Core-Settings"
New-GPLink -Name "LAB01-Core-Settings" -Target "DC=LAB01,DC=local" -LinkEnabled Yes

# Require NLA for RDP
Set-GPRegistryValue `
    -Name "LAB01-Core-Settings" `
    -Key  "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" `
    -ValueName "UserAuthentication" -Type DWord -Value 1

# Set TLS security layer
Set-GPRegistryValue `
    -Name "LAB01-Core-Settings" `
    -Key  "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" `
    -ValueName "SecurityLayer" -Type DWord -Value 2

# High encryption level
Set-GPRegistryValue `
    -Name "LAB01-Core-Settings" `
    -Key  "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" `
    -ValueName "MinEncryptionLevel" -Type DWord -Value 3

# Automatic certificate enrollment (computers and users)
Set-GPRegistryValue `
    -Name "LAB01-Core-Settings" `
    -Key  "HKLM\SOFTWARE\Policies\Microsoft\Cryptography\AutoEnrollment" `
    -ValueName "AEPolicy" -Type DWord -Value 7

Set-GPRegistryValue `
    -Name "LAB01-Core-Settings" `
    -Key  "HKCU\SOFTWARE\Policies\Microsoft\Cryptography\AutoEnrollment" `
    -ValueName "AEPolicy" -Type DWord -Value 7
```

---

## Step 4 — Clone WS2022-CA01 and join the domain

Clone `WS2022-TEMPLATE-BASE` to `WS2022-CA01` (2 vCPU, 4 GB RAM, same lab bridge). Configure the hostname and static IP on first boot:

```powershell
# RUN ON: WS2022-CA01 (192.168.178.211) — Local VM console / Elevated PowerShell

Rename-Computer -NewName "WS2022-CA01" -Force

$adapter = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object -First 1
Remove-NetIPAddress -InterfaceIndex $adapter.ifIndex -Confirm:$false -ErrorAction SilentlyContinue
Remove-NetRoute     -InterfaceIndex $adapter.ifIndex -Confirm:$false -ErrorAction SilentlyContinue

New-NetIPAddress `
    -InterfaceIndex  $adapter.ifIndex `
    -IPAddress       192.168.178.211 `
    -PrefixLength    24 `
    -DefaultGateway  192.168.178.1

# REQUIRED: point DNS to the AD server
Set-DnsClientServerAddress `
    -InterfaceIndex  $adapter.ifIndex `
    -ServerAddresses 192.168.178.210

Restart-Computer -Force
```

After the restart, join the domain:

```powershell
# RUN ON: WS2022-CA01 (192.168.178.211) — Elevated PowerShell

# Verify DNS resolution before joining the domain
Resolve-DnsName LAB01.local

# Join the domain
Add-Computer `
    -DomainName "LAB01.local" `
    -Credential (Get-Credential -Message "Enter LAB01\Administrator credentials") `
    -Restart -Force
```

---

## Step 5 — Install ADCS and configure the Certificate Authority

Log in as `LAB01\Administrator` on WS2022-CA01:

```powershell
# RUN ON: WS2022-CA01 (192.168.178.211) — Elevated PowerShell

# Check and install IIS
Get-WindowsFeature Web-Server
Install-WindowsFeature Web-Server -IncludeManagementTools

# Install the CA role and Web Enrollment
Install-WindowsFeature `
    -Name ADCS-Cert-Authority `
    -IncludeManagementTools `
    -IncludeAllSubFeature

Install-WindowsFeature ADCS-Web-Enrollment -IncludeManagementTools

# Verify installation
Get-WindowsFeature ADCS-Cert-Authority, ADCS-Web-Enrollment, Web-Server | `
    Select-Object Name, Installed, DisplayName

# Configure the Enterprise Root CA
Install-AdcsCertificationAuthority `
    -CAType                    EnterpriseRootCA `
    -CACommonName              "LAB01-Root-CA" `
    -CADistinguishedNameSuffix "DC=LAB01,DC=local" `
    -CryptoProviderName        "RSA#Microsoft Software Key Storage Provider" `
    -KeyLength                 4096 `
    -HashAlgorithmName         SHA256 `
    -ValidityPeriod            Years `
    -ValidityPeriodUnits       10 `
    -DatabaseDirectory         "C:\Windows\system32\CertLog" `
    -LogDirectory              "C:\Windows\system32\CertLog" `
    -Force

# Configure Web Enrollment
Install-AdcsWebEnrollment -Force

# Verify
Get-WindowsFeature ADCS-Web-Enrollment
Get-Service W3SVC
netstat -an | findstr :80

# Test the Web Enrollment page
Invoke-WebRequest `
    -Uri "http://localhost/certsrv" `
    -UseDefaultCredentials `
    | Select-Object StatusCode, StatusDescription
```

The Web Enrollment page is accessible at: `http://WS2022-CA01.LAB01.local/certsrv`

---

## Step 6 — Secure RDP with Set-RDPCert.ps1

Create the script in SYSVOL (run on WS2022-AD-DNS):

```powershell
# RUN ON: WS2022-AD-DNS (192.168.178.210) — Elevated PowerShell

notepad \\LAB01.local\SYSVOL\LAB01.local\scripts\Set-RDPCert.ps1
```

Paste the following script content into Notepad, save and close:

```powershell
#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Binds a CA-issued certificate to the RDP listener on every startup.
.DESCRIPTION
    Finds the most recent valid certificate in Cert:\LocalMachine\My issued by
    LAB01-Root-CA for the local computer's FQDN. If none is found, certificate
    auto-enrollment is triggered. The selected certificate thumbprint is written
    to the RDP-Tcp registry key and the Remote Desktop service is restarted.
.NOTES
    Deploy via SYSVOL and run as SYSTEM via Scheduled Task at startup.
    Lab: LAB01.local — WS2022-AD-DNS / WS2022-CA01
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$LogFile = "C:\Scripts\Set-RDPCert.log"

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp  $Message" | Tee-Object -FilePath $LogFile -Append | Write-Host
}

Write-Log "=== Set-RDPCert.ps1 started ==="

# ── 1. Determine the computer's FQDN ────────────────────────────────────────
$fqdn = [System.Net.Dns]::GetHostEntry('').HostName
Write-Log "FQDN: $fqdn"

# ── 2. Find a valid certificate issued by LAB01-Root-CA ─────────────────────
$rdpCert = Get-ChildItem Cert:\LocalMachine\My |
    Where-Object {
        $_.Issuer    -like "*LAB01-Root-CA*"  -and
        $_.Subject   -like "*$fqdn*"           -and
        $_.NotAfter  -gt (Get-Date)            -and
        $_.HasPrivateKey
    } |
    Sort-Object NotAfter -Descending |
    Select-Object -First 1

# ── 3. If no certificate found, trigger auto-enrollment and retry ────────────
if (-not $rdpCert) {
    Write-Log "No valid certificate found — triggering auto-enrollment..."
    & certutil -pulse | Out-Null
    Start-Sleep -Seconds 30

    $rdpCert = Get-ChildItem Cert:\LocalMachine\My |
        Where-Object {
            $_.Issuer    -like "*LAB01-Root-CA*"  -and
            $_.Subject   -like "*$fqdn*"           -and
            $_.NotAfter  -gt (Get-Date)            -and
            $_.HasPrivateKey
        } |
        Sort-Object NotAfter -Descending |
        Select-Object -First 1
}

if (-not $rdpCert) {
    Write-Log "ERROR: No certificate available after auto-enrollment. Aborting."
    exit 1
}

Write-Log "Certificate selected: $($rdpCert.Subject)"
Write-Log "Thumbprint : $($rdpCert.Thumbprint)"
Write-Log "Valid until: $($rdpCert.NotAfter)"

# ── 4. Grant the Network Service read access to the private key ──────────────
$keyPath = $rdpCert.PrivateKey.CspKeyContainerInfo.UniqueKeyContainerName
if ($keyPath) {
    $keyFile = Get-ChildItem "$env:ProgramData\Microsoft\Crypto\RSA\MachineKeys\$keyPath" `
               -ErrorAction SilentlyContinue
    if ($keyFile) {
        $acl  = Get-Acl $keyFile.FullName
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
                    "NT AUTHORITY\NETWORK SERVICE", "Read", "Allow")
        $acl.AddAccessRule($rule)
        Set-Acl -Path $keyFile.FullName -AclObject $acl
        Write-Log "Private key ACL updated for NETWORK SERVICE."
    }
}

# ── 5. Bind the certificate to the RDP listener ──────────────────────────────
$rdpReg = "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp"
Set-ItemProperty -Path $rdpReg -Name SSLCertificateSHA1Hash -Value $rdpCert.Thumbprint
Write-Log "Registry updated with new thumbprint."

# ── 6. Restart Remote Desktop Services to apply the new certificate ──────────
Write-Log "Restarting TermService..."
Restart-Service -Name TermService -Force
Write-Log "TermService restarted."

Write-Log "=== Set-RDPCert.ps1 completed successfully ==="
```

Save the file and close Notepad. Then copy the script locally and register the Scheduled Task — on **both servers**:

```powershell
# RUN ON: BOTH SERVERS — WS2022-AD-DNS + WS2022-CA01 — Elevated PowerShell

# Create local copy
If (-Not (Test-Path "C:\Scripts")) { New-Item -ItemType Directory -Path "C:\Scripts" -Force }
Copy-Item `
    -Path        "\\LAB01.local\SYSVOL\LAB01.local\scripts\Set-RDPCert.ps1" `
    -Destination "C:\Scripts\Set-RDPCert.ps1" `
    -Force

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine -Force

# Register the Scheduled Task
$action    = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NonInteractive -ExecutionPolicy Bypass -File C:\Scripts\Set-RDPCert.ps1"
$trigger   = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$settings  = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 1) `
    -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 5) -StartWhenAvailable $true

Register-ScheduledTask `
    -TaskName "Set-RDPCertificate" -TaskPath "\LAB01\" `
    -Action $action -Trigger $trigger -Principal $principal -Settings $settings `
    -Description "Binds CA certificate to RDP on every startup" -Force

# Run immediately for first-time installation
Start-ScheduledTask -TaskPath "\LAB01\" -TaskName "Set-RDPCertificate"
```

---

## Step 7 — Trust the Root CA certificate on Mac Mini M1

```bash
# RUN ON: Mac Mini M1 — Terminal (macOS)

# Download the Root CA certificate
curl -o ~/Downloads/LAB01-Root-CA.cer http://192.168.178.211/LAB01-Root-CA.cer

# Install in the System Keychain as trusted root
sudo security add-trusted-cert \
    -d \
    -r trustRoot \
    -k /Library/Keychains/System.keychain \
    ~/Downloads/LAB01-Root-CA.cer
```

Add both VMs in Microsoft Remote Desktop:
- `192.168.178.210` — `LAB01\Administrator` — WS2022-AD-DNS
- `192.168.178.211` — `LAB01\Administrator` — WS2022-CA01

RDP connections will no longer show certificate warnings.

---

## Verification

```powershell
# WS2022-AD-DNS — full DC diagnostics
dcdiag /test:Replications /test:DNS /test:KnowsOfRoleHolders /v

# WS2022-CA01 — CA and Web Enrollment
Get-Service certsvc | Select-Object Name, Status
Get-WindowsFeature ADCS-Web-Enrollment
Get-Service W3SVC
netstat -an | findstr :80
certutil -CRL
certutil -verifystore Root "LAB01-Root-CA"

# Both servers — verify RDP certificate
$rdpReg = "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp"
$thumb  = (Get-ItemProperty $rdpReg -Name SSLCertificateSHA1Hash).SSLCertificateSHA1Hash
Get-ChildItem Cert:\LocalMachine\My | Where-Object { $_.Thumbprint -eq $thumb } |
    Select-Object Subject, Thumbprint, NotAfter, Issuer
```

---

## Download

The complete manual — including all commands, the full `Set-RDPCert.ps1` script content, troubleshooting and reference — is available as a Word document:

> **[WS2022-Lab-Manual-EN.docx](https://vandenboom.icu/blog/2026-windows-server-2022-home-lab-ad-dns-ca-rdp/WS2022-Lab-Manual-EN.docx)**

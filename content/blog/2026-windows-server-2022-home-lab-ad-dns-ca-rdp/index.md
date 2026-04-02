---
title: "Windows Server 2022 Home Lab — AD DS, DNS, CA en Beveiligde RDP"
date: 2026-04-02
author: "ing. M.A.C.M. (Martijn) van den Boom"
description: "Volledige stap-voor-stap handleiding voor het opbouwen van een Windows Server 2022 home lab in Proxmox: Active Directory, DNS, Certificate Authority, Group Policy en beveiligde RDP-verbindingen vanaf macOS."
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
  - beveiliging
---

Dit artikel beschrijft de volledige opbouw van een twee-server Windows Server 2022 home lab in Proxmox VE. De twee virtuele machines leveren samen Active Directory Domain Services, DNS, Group Policy en een Certificate Authority (ADCS). RDP-verbindingen worden beveiligd met PKI-certificaten, zodat de Mac Mini M1 als beheerstation zonder certificaatwaarschuwingen verbinding maakt.

Dit is deel 3 van de serie over het opbouwen van een Windows DevOps lab in Proxmox. In [deel 1](https://vandenboom.icu/blog/2026-proxmox-windows-server-2022-vm-aanmaken/) heb ik beschreven hoe je een VM aanmaakt, in [deel 2](https://vandenboom.icu/blog/2026-proxmox-windows-server-2022-template-voorbereiding/) hoe je de template voorbereidt.

> **Download de volledige handleiding als Word-document (.docx):**
> [WS2022-Lab-Handleiding-NL.docx](https://vandenboom.icu/blog/2026-windows-server-2022-home-lab-ad-dns-ca-rdp/WS2022-Lab-Handleiding-NL.docx)

---

## Laboratoriumomgeving

| Onderdeel | Waarde |
|---|---|
| Proxmox-host | macpro2013.local |
| Proxmox-console | https://macpro2013.local:8006 |
| Beheerstation | Mac Mini M1 |
| VM 1 — AD + DNS | WS2022-AD-DNS — 192.168.178.210 |
| VM 2 — CA | WS2022-CA01 — 192.168.178.211 |
| Standaard gateway | 192.168.178.1 |
| Subnetprefix | /24 |
| Domein | LAB01.local |
| Resources (beide VMs) | 2 vCPU / 4 GB RAM |
| Template | WS2022-TEMPLATE-BASE |

---

## Bouwvolgorde

De CA heeft een harde afhankelijkheid van een werkende AD en DNS. Altijd in deze volgorde bouwen:

1. Kloon `WS2022-TEMPLATE-BASE` naar `WS2022-AD-DNS` en stel hostnaam en vast IP in
2. Installeer AD DS + DNS en promoveer naar Domain Controller
3. Configureer DNS-zones, SYSVOL-scriptmap en Group Policy
4. Kloon `WS2022-TEMPLATE-BASE` naar `WS2022-CA01` en voeg toe aan het domein
5. Installeer ADCS (Enterprise Root CA), Web Enrollment en IIS
6. Configureer certificaatsjablonen en CRL-distributiepunten
7. Deploy `Set-RDPCert.ps1` via SYSVOL en Scheduled Task op beide servers
8. Vertrouw het Root CA-certificaat op de Mac Mini M1

---

## Stap 1 — WS2022-AD-DNS klonen en voorbereiden

Kloon `WS2022-TEMPLATE-BASE` naar `WS2022-AD-DNS` via de Proxmox-console. Stel 2 vCPU en 4 GB RAM in en koppel de VM aan de lab-bridge.

Na het opstarten, log in als lokale Administrator en voer het volgende uit in een verhoogde PowerShell-sessie:

```powershell
# UITVOEREN OP: WS2022-AD-DNS (192.168.178.210) — Elevated PowerShell

# Hernoem de computer
Rename-Computer -NewName "WS2022-AD-DNS" -Force

# Identificeer de actieve netwerkadapter
$adapter = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object -First 1

# Verwijder eventuele DHCP-configuratie
Remove-NetIPAddress -InterfaceIndex $adapter.ifIndex -Confirm:$false -ErrorAction SilentlyContinue
Remove-NetRoute     -InterfaceIndex $adapter.ifIndex -Confirm:$false -ErrorAction SilentlyContinue

# Wijs een vast IP-adres toe
New-NetIPAddress `
    -InterfaceIndex  $adapter.ifIndex `
    -IPAddress       192.168.178.210 `
    -PrefixLength    24 `
    -DefaultGateway  192.168.178.1

# Wijs DNS toe aan loopback — na AD DS-installatie wijzen naar eigen IP
Set-DnsClientServerAddress `
    -InterfaceIndex  $adapter.ifIndex `
    -ServerAddresses 127.0.0.1

# Herstart om hostnaam toe te passen
Restart-Computer -Force
```

---

## Stap 2 — AD DS en DNS installeren

Log na herstart in als lokale Administrator en voer het volgende uit:

```powershell
# UITVOEREN OP: WS2022-AD-DNS (192.168.178.210) — Elevated PowerShell

# Installeer AD DS en DNS met alle beheertools
Install-WindowsFeature `
    -Name AD-Domain-Services, DNS `
    -IncludeManagementTools `
    -IncludeAllSubFeature

# Promoveer naar Domain Controller en maak het nieuwe forest aan
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

De server herstart automatisch. Log daarna in als `LAB01\Administrator`.

Na herstart: update de DNS-pointer en maak de reverse-zoekzone aan:

```powershell
# UITVOEREN OP: WS2022-AD-DNS (192.168.178.210) — Elevated PowerShell

# Update DNS-pointer naar eigen IP
$adapter = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object -First 1
Set-DnsClientServerAddress `
    -InterfaceIndex  $adapter.ifIndex `
    -ServerAddresses 192.168.178.210, 8.8.8.8

# Maak reverse-zoekzone aan
Add-DnsServerPrimaryZone `
    -NetworkID        "192.168.178.0/24" `
    -ReplicationScope "Forest"

# Voeg PTR-record toe voor de AD-server
Add-DnsServerResourceRecordPtr `
    -ZoneName      "178.168.192.in-addr.arpa" `
    -Name          "210" `
    -PtrDomainName "WS2022-AD-DNS.LAB01.local."

# Maak de SYSVOL-scriptmap aan
$scriptShare = "\\LAB01.local\SYSVOL\LAB01.local\scripts"
If (-Not (Test-Path $scriptShare)) {
    New-Item -ItemType Directory -Path $scriptShare -Force
}
```

---

## Stap 3 — Group Policy configureren

```powershell
# UITVOEREN OP: WS2022-AD-DNS (192.168.178.210) — Elevated PowerShell

Import-Module GroupPolicy

# Maak het GPO aan en koppel aan de domeinroot
$gpo = New-GPO -Name "LAB01-Core-Settings"
New-GPLink -Name "LAB01-Core-Settings" -Target "DC=LAB01,DC=local" -LinkEnabled Yes

# NLA verplichten voor RDP
Set-GPRegistryValue `
    -Name "LAB01-Core-Settings" `
    -Key  "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" `
    -ValueName "UserAuthentication" -Type DWord -Value 1

# TLS-beveiligingslaag instellen
Set-GPRegistryValue `
    -Name "LAB01-Core-Settings" `
    -Key  "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" `
    -ValueName "SecurityLayer" -Type DWord -Value 2

# Hoog versleutelingsniveau
Set-GPRegistryValue `
    -Name "LAB01-Core-Settings" `
    -Key  "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" `
    -ValueName "MinEncryptionLevel" -Type DWord -Value 3

# Automatische certificaatregistratie (computers en gebruikers)
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

## Stap 4 — WS2022-CA01 klonen en aan domein toevoegen

Kloon `WS2022-TEMPLATE-BASE` naar `WS2022-CA01` (2 vCPU, 4 GB RAM, zelfde lab-bridge). Stel bij eerste opstart hostnaam en vast IP in:

```powershell
# UITVOEREN OP: WS2022-CA01 (192.168.178.211) — Lokale VM-console / Elevated PowerShell

Rename-Computer -NewName "WS2022-CA01" -Force

$adapter = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object -First 1
Remove-NetIPAddress -InterfaceIndex $adapter.ifIndex -Confirm:$false -ErrorAction SilentlyContinue
Remove-NetRoute     -InterfaceIndex $adapter.ifIndex -Confirm:$false -ErrorAction SilentlyContinue

New-NetIPAddress `
    -InterfaceIndex  $adapter.ifIndex `
    -IPAddress       192.168.178.211 `
    -PrefixLength    24 `
    -DefaultGateway  192.168.178.1

# VERPLICHT: DNS wijzen naar de AD-server
Set-DnsClientServerAddress `
    -InterfaceIndex  $adapter.ifIndex `
    -ServerAddresses 192.168.178.210

Restart-Computer -Force
```

Na herstart, domein toevoegen:

```powershell
# UITVOEREN OP: WS2022-CA01 (192.168.178.211) — Elevated PowerShell

# Verifieer DNS-omzetting vóór domeintoevoeging
Resolve-DnsName LAB01.local

# Voeg toe aan het domein
Add-Computer `
    -DomainName "LAB01.local" `
    -Credential (Get-Credential -Message "Voer LAB01\Administrator-gegevens in") `
    -Restart -Force
```

---

## Stap 5 — ADCS installeren en Certificate Authority configureren

Log in als `LAB01\Administrator` op WS2022-CA01:

```powershell
# UITVOEREN OP: WS2022-CA01 (192.168.178.211) — Elevated PowerShell

# Controleer en installeer IIS
Get-WindowsFeature Web-Server
Install-WindowsFeature Web-Server -IncludeManagementTools

# Installeer de CA-rol en Web Enrollment
Install-WindowsFeature `
    -Name ADCS-Cert-Authority `
    -IncludeManagementTools `
    -IncludeAllSubFeature

Install-WindowsFeature ADCS-Web-Enrollment -IncludeManagementTools

# Verifieer installatie
Get-WindowsFeature ADCS-Cert-Authority, ADCS-Web-Enrollment, Web-Server | `
    Select-Object Name, Installed, DisplayName

# Configureer de Enterprise Root CA
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

# Configureer Web Enrollment
Install-AdcsWebEnrollment -Force

# Verifieer
Get-WindowsFeature ADCS-Web-Enrollment
Get-Service W3SVC
netstat -an | findstr :80

# Test de Web Enrollment-pagina
Invoke-WebRequest `
    -Uri "http://localhost/certsrv" `
    -UseDefaultCredentials `
    | Select-Object StatusCode, StatusDescription
```

De Web Enrollment-pagina is bereikbaar via: `http://WS2022-CA01.LAB01.local/certsrv`

---

## Stap 6 — RDP beveiligen met Set-RDPCert.ps1

Maak het script aan in SYSVOL (uitvoeren op WS2022-AD-DNS):

```powershell
# UITVOEREN OP: WS2022-AD-DNS (192.168.178.210) — Elevated PowerShell

notepad \\LAB01.local\SYSVOL\LAB01.local\scripts\Set-RDPCert.ps1
```

Plak de volgende scriptinhoud in Notepad, sla op en sluit:

```powershell
#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Koppelt een door de CA uitgegeven certificaat aan de RDP-listener bij elke opstart.
.DESCRIPTION
    Zoekt het meest recente geldige certificaat in Cert:\LocalMachine\My dat is
    uitgegeven door LAB01-Root-CA voor de FQDN van de lokale computer. Wordt geen
    certificaat gevonden, dan wordt auto-enrollment geactiveerd. Het geselecteerde
    certificaat-thumbprint wordt weggeschreven naar de RDP-Tcp-registersleutel,
    waarna de Remote Desktop-service herstart.
.NOTES
    Uitrollen via SYSVOL en uitvoeren als SYSTEM via Scheduled Task bij opstart.
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

Write-Log "=== Set-RDPCert.ps1 gestart ==="

# ── 1. FQDN van de computer bepalen ─────────────────────────────────────────
$fqdn = [System.Net.Dns]::GetHostEntry('').HostName
Write-Log "FQDN: $fqdn"

# ── 2. Geldig certificaat zoeken, uitgegeven door LAB01-Root-CA ──────────────
$rdpCert = Get-ChildItem Cert:\LocalMachine\My |
    Where-Object {
        $_.Issuer    -like "*LAB01-Root-CA*"  -and
        $_.Subject   -like "*$fqdn*"           -and
        $_.NotAfter  -gt (Get-Date)            -and
        $_.HasPrivateKey
    } |
    Sort-Object NotAfter -Descending |
    Select-Object -First 1

# ── 3. Geen certificaat gevonden: auto-enrollment activeren en opnieuw zoeken ─
if (-not $rdpCert) {
    Write-Log "Geen geldig certificaat gevonden — auto-enrollment activeren..."
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
    Write-Log "FOUT: geen certificaat beschikbaar na auto-enrollment. Script afgebroken."
    exit 1
}

Write-Log "Geselecteerd certificaat: $($rdpCert.Subject)"
Write-Log "Thumbprint  : $($rdpCert.Thumbprint)"
Write-Log "Geldig t/m  : $($rdpCert.NotAfter)"

# ── 4. Network Service leesrechten geven op de privésleutel ─────────────────
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
        Write-Log "ACL privésleutel bijgewerkt voor NETWORK SERVICE."
    }
}

# ── 5. Certificaat koppelen aan de RDP-listener ──────────────────────────────
$rdpReg = "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp"
Set-ItemProperty -Path $rdpReg -Name SSLCertificateSHA1Hash -Value $rdpCert.Thumbprint
Write-Log "Register bijgewerkt met nieuw thumbprint."

# ── 6. Remote Desktop Services herstarten om het nieuwe certificaat toe te passen
Write-Log "TermService herstarten..."
Restart-Service -Name TermService -Force
Write-Log "TermService herstart."

Write-Log "=== Set-RDPCert.ps1 succesvol afgerond ==="
```

Sla het bestand op en sluit Notepad. Kopieer het script vervolgens lokaal en registreer de Scheduled Task — op **beide servers**:

```powershell
# UITVOEREN OP: BEIDE SERVERS — WS2022-AD-DNS + WS2022-CA01 — Elevated PowerShell

# Lokale kopie aanmaken
If (-Not (Test-Path "C:\Scripts")) { New-Item -ItemType Directory -Path "C:\Scripts" -Force }
Copy-Item `
    -Path        "\\LAB01.local\SYSVOL\LAB01.local\scripts\Set-RDPCert.ps1" `
    -Destination "C:\Scripts\Set-RDPCert.ps1" `
    -Force

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine -Force

# Scheduled Task registreren
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
    -Description "Koppelt CA-certificaat aan RDP bij elke opstart" -Force

# Direct uitvoeren voor eerste installatie
Start-ScheduledTask -TaskPath "\LAB01\" -TaskName "Set-RDPCertificate"
```

---

## Stap 7 — Root CA-certificaat vertrouwen op Mac Mini M1

```bash
# UITVOEREN OP: Mac Mini M1 — Terminal (macOS)

# Download het Root CA-certificaat
curl -o ~/Downloads/LAB01-Root-CA.cer http://192.168.178.211/LAB01-Root-CA.cer

# Installeer in de System Keychain als vertrouwde root
sudo security add-trusted-cert \
    -d \
    -r trustRoot \
    -k /Library/Keychains/System.keychain \
    ~/Downloads/LAB01-Root-CA.cer
```

Voeg beide VM's toe in Microsoft Remote Desktop:
- `192.168.178.210` — `LAB01\Administrator` — WS2022-AD-DNS
- `192.168.178.211` — `LAB01\Administrator` — WS2022-CA01

RDP-verbindingen tonen nu geen certificaatwaarschuwingen meer.

---

## Verificatie

```powershell
# WS2022-AD-DNS — volledig DC-diagnose
dcdiag /test:Replications /test:DNS /test:KnowsOfRoleHolders /v

# WS2022-CA01 — CA en Web Enrollment
Get-Service certsvc | Select-Object Name, Status
Get-WindowsFeature ADCS-Web-Enrollment
Get-Service W3SVC
netstat -an | findstr :80
certutil -CRL
certutil -verifystore Root "LAB01-Root-CA"

# Beide servers — RDP-certificaat verifiëren
$rdpReg = "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp"
$thumb  = (Get-ItemProperty $rdpReg -Name SSLCertificateSHA1Hash).SSLCertificateSHA1Hash
Get-ChildItem Cert:\LocalMachine\My | Where-Object { $_.Thumbprint -eq $thumb } |
    Select-Object Subject, Thumbprint, NotAfter, Issuer
```

---

## Download

De volledige handleiding — inclusief alle commando's, de complete `Set-RDPCert.ps1`-scriptinhoud, probleemoplossing en naslag — is beschikbaar als Word-document:

> **[WS2022-Lab-Handleiding-NL.docx](https://vandenboom.icu/blog/2026-windows-server-2022-home-lab-ad-dns-ca-rdp/WS2022-Lab-Handleiding-NL.docx)**

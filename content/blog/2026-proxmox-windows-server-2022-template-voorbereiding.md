---
title: "Proxmox Lab — Windows Server 2022 Template voorbereiding"
date: 2026-03-31T10:00:00+01:00
description: "Van eerste opstart tot Sysprep — stap voor stap handleiding voor het voorbereiden van een Windows Server 2022 VM als herbruikbaar Proxmox-template. Inclusief VirtIO-drivers, Windows Update via PowerShell, prestatieoptimalisaties en Sysprep."
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

Deze handleiding beschrijft het volledige proces voor het voorbereiden van een vers geïnstalleerde Windows Server 2022 VM als herbruikbaar Proxmox-template. Alle toekomstige VM's (CA-server, lidservers, enzovoort) worden gekloond vanuit dit template, wat aanzienlijk tijd bespaart en een consistente basisinstallatie garandeert.

> 📄 **Download de volledige handleiding met screenshots:**
> [WS2022-in-Proxmox-Template-Preparation-Guide.docx](/documents/WS2022-in-Proxmox-Template-Preparation-Guide.docx)

---

## Overzicht

Het volledige proces bestaat uit de volgende stappen:

1. VirtIO guest-drivers installeren
2. Windows Update uitvoeren — OS volledig patchen
3. Prestatieoptimalisaties toepassen
4. Basisconfiguratie — tijdzone, RDP, IE Enhanced Security
5. Sysprep — generaliseren en afsluiten
6. Converteren naar template in Proxmox

> **Waarschuwing:** Start de VM nooit opnieuw op na Sysprep. Als je dat toch doet, wordt de generalisatie verbruikt en moet het template opnieuw worden opgebouwd vanaf het begin.

---

## Stap 1 — VirtIO Guest-Drivers installeren

VirtIO guest-drivers zijn vereist zodat Windows correct functioneert op Proxmox. Ze omvatten de opslagcontroller, netwerkadapter, geheugenballon, weergave en andere paravirtualiseerde apparaten.

Open **Verkenner** in de Windows VM en navigeer naar het VirtIO-cd-station (D: of E:). Scroll naar het einde van de bestandslijst en dubbelklik op **virtio-win-guest-tools.exe** (het Application-bestand, circa 30 MB). Dit ene installatieprogramma regelt alle benodigde drivers in één keer. Accepteer de standaardwaarden en laat de installatie voltooien.

> **Tip:** Gebruik altijd `virtio-win-guest-tools.exe` in plaats van afzonderlijke drivers te installeren vanuit de submappen. Het is sneller en zorgt ervoor dat niets wordt gemist.

---

## Stap 2 — Windows Update

Het volledig patchen van het OS vóór Sysprep zorgt ervoor dat elke gekloonde VM direct up-to-date start zonder individuele updates te hoeven uitvoeren.

### 2.1 Windows Update starten

Open **Instellingen → Update & Beveiliging → Windows Update** en klik op **Controleren op updates**. Beschikbare updates beginnen te downloaden en te installeren.

### 2.2 Bekende problemen met de Windows Update GUI

De Windows Update GUI in Server 2022 VM's is onbetrouwbaar. Knoppen reageren regelmatig niet meer en downloads lijken te hangen. Dit is een bekend probleem in VM-omgevingen.

> **Waarschuwing:** Probeer nooit het vastlopen van de Windows Update GUI via de GUI zelf op te lossen. Schakel over naar de PowerShell-methode hieronder.

### 2.3 Aanbevolen methode — PSWindowsUpdate via PowerShell

Open **PowerShell als Administrator** (rechtermuisklik op Start → Windows PowerShell (Admin)):

**Stap 1 — Installeer de PSWindowsUpdate-module:**

```powershell
Install-Module PSWindowsUpdate -Force -Confirm:$false
```

Typ `Y` en druk op Enter wanneer gevraagd wordt de NuGet-provider te installeren of PSGallery te vertrouwen.

**Stap 2 — Importeer de module en voer alle updates uit:**

```powershell
Import-Module PSWindowsUpdate
Get-WindowsUpdate -Install -AcceptAll -AutoReboot
```

De VM herstart automatisch indien nodig. Na de herstart log je opnieuw in en voer je de opdracht opnieuw uit totdat er geen updates meer zijn:

```powershell
Get-WindowsUpdate -Install -AcceptAll -AutoReboot
```

Voer Windows Update een tweede keer uit om te bevestigen dat niets is gemist. Sommige updates worden pas beschikbaar nadat andere zijn geïnstalleerd.

> **Tip:** Sommige updates (zoals KB890830 — Windows Malicious Software Removal Tool) kunnen aanhoudend mislukken in VM-omgevingen. Dit is bekend en onschadelijk — het heeft geen invloed op de serverfunctionaliteit en kan veilig worden overgeslagen.

---

## Stap 3 — Prestatieoptimalisaties

Pas deze optimalisaties toe in PowerShell (Admin) vóór Sysprep, zodat elke gekloonde VM er automatisch van profiteert:

```powershell
# Hoog-prestatieplan inschakelen
powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c

# Windows Search-indexering uitschakelen — niet nodig op servers
Set-Service WSearch -StartupType Disabled
Stop-Service WSearch -Force

# SysMain / Superfetch uitschakelen — niet nuttig in VM's
Set-Service SysMain -StartupType Disabled
Stop-Service SysMain -Force
```

> **Tip:** Verander ook de VM-weergave van **Default** naar **VirtIO-GPU** in het tabblad Proxmox Hardware. Dit verbetert de responsiviteit van de console aanzienlijk.

---

## Stap 4 — Basisconfiguratie

Voer deze opdrachten uit in PowerShell (Admin):

```powershell
# Tijdzone instellen op Amsterdam
Set-TimeZone -Name "W. Europe Standard Time"

# RDP inschakelen
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections" -Value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"

# NLA uitschakelen voor eenvoudigere labtoegang
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name "UserAuthentication" -Value 0

# IE Enhanced Security Configuration uitschakelen
$AdminKey = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A7-37EF-4b3f-8CFC-4F3A74704073}"
$UserKey  = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A8-37EF-4b3f-8CFC-4F3A74704073}"
Set-ItemProperty -Path $AdminKey -Name "IsInstalled" -Value 0
Set-ItemProperty -Path $UserKey  -Name "IsInstalled" -Value 0
```

> **Waarschuwing:** Na het inschakelen van RDP via het register is een herstart vereist voordat poort 3389 begint te luisteren. Voer `Restart-Computer` uit en wacht tot de VM weer beschikbaar is.

### 4.1 RDP-verbinding verifiëren

Verifieer na het herstarten of RDP werkt vanuit de Proxmox-hostshell:

```bash
ping 192.168.178.11          # Reageert met 0% pakketverlies
nc -zv 192.168.178.11 3389   # Poort open bevestigt dat RDP luistert
```

> **Tip:** Als `nc` *Connection refused* toont na het inschakelen van RDP, is een herstart nodig. RDP begint pas te luisteren na een herstart.

---

## Stap 5 — Sysprep

Sysprep generaliseert de installatie door alle machine-specifieke identificatoren te verwijderen, waaronder de Security Identifier (SID), computernaam en hardwareverwijzingen. Dit is essentieel — zonder Sysprep zou elke gekloonde VM dezelfde SID delen, wat Active Directory-conflicten veroorzaakt.

> **Waarschuwing:** Dit is het punt van geen terugkeer. Nadat Sysprep de VM heeft afgesloten, mag je de VM **niet** opnieuw opstarten. Ga direct naar Proxmox en converteer de VM naar een template.

Voer dit uit in PowerShell (Admin) of de opdrachtprompt:

```powershell
C:\Windows\System32\Sysprep\sysprep.exe /oobe /generalize /shutdown
```

Uitleg van de vlaggen:

| Vlag | Functie |
|------|---------|
| /generalize | Verwijdert unieke systeemidentificatoren — SID, computernaam, hardware-ID's |
| /oobe | Stelt Windows in om de eerste installatie bij de volgende opstart uit te voeren |
| /shutdown | Sluit de VM automatisch af wanneer Sysprep klaar is |

Sysprep duurt circa 2–5 minuten. De VM sluit zichzelf af wanneer het proces is voltooid.

---

## Stap 6 — Converteren naar Template in Proxmox

Zodra de VM zichzelf heeft afgesloten na Sysprep, ga je naar het Proxmox-linker paneel:

1. Rechtsklik op de VM (bijv. **900 WS2022-TEMPLATE-BASE**)
2. Selecteer **Convert to template**
3. Bevestig de actie

Het VM-pictogram verandert in een template-pictogram. De VM kan niet meer rechtstreeks worden gestart — alleen worden gekloond.

---

## Stap 7 — Template klonen voor nieuwe VM's

Om een nieuwe VM te maken vanuit het template:

1. Rechtsklik op het template in het Proxmox-linker paneel
2. Selecteer **Clone**
3. Stel **Mode** in op **Full Clone** — niet Linked Clone
4. Voer de nieuwe VM-naam in volgens de naamgevingsconventie (bijv. WS2022-LAB02-CA)
5. Stel het VM-ID in
6. Klik op **Clone**

> **Waarschuwing:** Gebruik altijd **Full Clone**. Linked Clones zijn afhankelijk van de templateschijf en kunnen niet zelfstandig functioneren. Full Clones zijn volledig onafhankelijke VM's.

Na het klonen start de nieuwe VM op in Windows OOBE (eerste installatie), waar je het Administrator-wachtwoord, de computernaam en de netwerkinstellingen configureert voordat je het domein toevoegt.

---

## Samenvatting checklist

1. virtio-win-guest-tools.exe installeren vanaf het VirtIO-cd-station ☐
2. PSWindowsUpdate uitvoeren totdat volledig gepatcht — herhalen na elke herstart ☐
3. Hoog-prestatieplan instellen via powercfg ☐
4. WSearch en SysMain services uitschakelen ☐
5. Proxmox-weergave wijzigen naar VirtIO-GPU in het Hardware-tabblad ☐
6. Tijdzone instellen op W. Europe Standard Time ☐
7. RDP inschakelen en NLA uitschakelen ☐
8. IE Enhanced Security Configuration uitschakelen ☐
9. Herstarten en RDP op poort 3389 verifiëren via nc ☐
10. Sysprep uitvoeren: /oobe /generalize /shutdown ☐
11. VM direct na afsluiten converteren naar template in Proxmox ☐

---

> 📄 **Download de volledige handleiding met screenshots:**
> [WS2022-in-Proxmox-Template-Preparation-Guide.docx](/documents/WS2022-in-Proxmox-Template-Preparation-Guide.docx)

Vriendelijke groeten,

Martijn

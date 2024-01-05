---
title: PowerShell computer resource monitor script with cpu percentage and
  advanced memory information
date: 2024-01-04T22:21:38.732Z
draft: false
categories:
  - article
tags:
  - PowerShell
  - computer
  - resource
  - monitor
  - script
  - cpu
  - percentage
  - advanced
  - memory
  - information
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
PowerShell computer resource monitor script with cpu percentage and advanced memory information

```
PowerShell

Resource monitor 


 $app="notepad"
 $ids = Get-Process $app | Select-Object -Property Id | ForEach-Object {$_.Id}

 $filedate = Get-Date -format "yyyy-MM-dd"

 #echo $pids

 foreach ($id in $ids) {
  
   $date = Get-Date -format "yyyy-MM-dd HH:mm:ss"

   # process CPU information

   $ProcessId = $id
   $Process = Get-WmiObject -Query "SELECT * FROM Win32_PerfFormattedData_PerfProc_Process WHERE IDProcess = $ProcessId"
   $usage = $Process.PercentProcessorTime
    
   
   # process Mem information

   $TotalMemory = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB

   $ProcessMem = Get-CIMInstance Win32_Process -Filter "ProcessId = '$id'"
   $MemSizeInKB = $ProcessMem.WS/1KB
   $PeakWorkingSetInKB = $Process.PeakWorkingSet/1KB
   $PageCountInKB = $ProcessMem.PrivatePageCount/1KB
   $NonPagedPoolInKB = $ProcessMem.QuotaNonPagedPoolUsage/1KB
   $PagedPoolInKB = $ProcessMem.QuotaPagedPoolUsage/1KB
   
   $TotalMemory = "{0:n3}" -f $TotalMemory
   $MemSizeInKB = "{0:n3}" -f $MemSizeInKB
   $PeakWorkingSetInKB = "{0:n3}" -f $PeakWorkingSetInKB
   $PageCountInKB = "{0:n3}" -f $PageCountInKB
   $NonPagedPoolInKB = "{0:n3}" -f $NonPagedPoolInKB
   $PagedPoolInKB = "{0:n3}" -f $PagedPoolInKB
   
   #write-host "$TotalMemory"
   #write-host "$MemSizeInKB"
   #write-host "$PeakWorkingSetInKB"
   #write-host "$PageCountInKB"
   #write-host "$NonPagedPoolInKB"
   #write-host "$PagedPoolInKB"
   
   # commandline information
   $commandline = (Get-CimInstance Win32_Process -Filter "ProcessId=$id").CommandLine
   
   $FileName = $filedate+"_memory_usage.txt"
   $FullPath = Join-Path -Path "C:\Users\mvdbo\OneDrive\Documenten\PowerShell" -ChildPath $FileName

   $regel = "$date - pid: $id - cpu: $usage % - mem: $MemSizeInKB KB - pws: $PeakWorkingSetInKB KB - pc: $PageCountInKB KB - pp: $PagedPoolInKB KB - command: $commandline"
   $regel | Out-File -FilePath $FullPath -Encoding utf8 -Append
     
 }

 # Sources
 # https://learn.microsoft.com/en-us/windows/win32/psapi/process-memory-usage-information
```
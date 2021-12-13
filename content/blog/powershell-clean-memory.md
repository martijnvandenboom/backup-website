+++
title = "Powershell Clean Memory"
description = "Commands"
author = "van den Boom"
date = 2021-12-13T19:12:03+01:00
tags = ["powershell", "markdown", "css", "html", "themes"]
categories = ["scripting", "themes", "syntax"]
+++

{{< highlight html >}}

Function Opschonen-geheugen {

  Get-PSSession | Remove-PSSession
  [System.GC]::Collect()         
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()

  Get-Variable |
  #Where-Object { $startupVariables -notcontains $_.Name } |
  ForEach-Object {
    try {
      Clear-Variable -Name "$($_.Name)" -Force -ErrorAction SilentlyContinue -WarningAction SilentlyContinue
      Remove-Variable -Name "$($_.Name)" -Force -Scope "global" -ErrorAction SilentlyContinue -WarningAction SilentlyContinue
      Remove-Variable -Name "$($_.Name)" -Force -ErrorAction SilentlyContinue -WarningAction SilentlyContinue
      #Write-Host "Variabele '$($_.Name)' is opgeruimd."
    }
    catch [Exception] {
      if ($_.Name -notlike '') { Write-Host "An error has occured. Error Details: $($_.Exception.Message)" }
    }
  }

  #Get-Variable

}

{{< /highlight >}}

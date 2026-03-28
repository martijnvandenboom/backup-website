---
title: Java een variabele omzetten om af te drukken in een prijsnotatie gerelateerd
  aan landinstellingen
date: 2025-01-05T20:09:27.423Z
draft: false
categories:
  - article
tags:
  - java
  - convert
  - variable
  - printed
  - price
  - format
  - country
  - settings
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
V﻿oor Nederlandse euro gebruik: .getCurrencyInstance(new Locale("nl", "NL"))

V﻿oor Zwitserse frank gebruik: .getCurrencyInstance(new Locale("de", "CH"))

```java
import java.text.NumberFormat;
import java.util.Locale;


public class prog_002_variables {

    public static void main(String[] args){

        String message;
        int year;
        double prijs;

        message = "De beste wensen voor: ";
        year = 2025;
        prijs = 2.50;

        // Combineer het aanmaken van de Locale en NumberFormat op één regel
        NumberFormat currencyFormat;

        currencyFormat = NumberFormat.getCurrencyInstance(new Locale("nl", "NL"));
        System.out.println(message + year + ", een frikandel kost nu: " + currencyFormat.format(prijs));

        currencyFormat = NumberFormat.getCurrencyInstance(new Locale("de", "CH"));
        System.out.println(message + year + ", een frikandel kost nu: " + currencyFormat.format(prijs));

    }

}

```

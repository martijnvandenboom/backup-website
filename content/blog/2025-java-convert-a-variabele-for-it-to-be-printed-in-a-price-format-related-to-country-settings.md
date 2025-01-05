---
title: Java convert a variabele for it to be printed in a price format related
  to country settings
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
F﻿or Dutch Euro use: .getCurrencyInstance(new Locale("nl", "NL"))

F﻿or Swiss Franc use: .getCurrencyInstance(new Locale("de", "CH"))

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

        // Combine the creation of the Locale and the NumberFormat in one line
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("nl", "NL"));

        System.out.println(message + year + ", een frikandel kost nu: " + currencyFormat.format(prijs));

    }

}
```
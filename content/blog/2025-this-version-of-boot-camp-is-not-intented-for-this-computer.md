---
title: Deze versie van BootCamp is niet bedoeld voor deze computer
date: 2025-04-28T16:04:39.408Z
draft: false
categories:
  - article
tags:
  - version
  - boot
  - camp
  - not
  - intended
  - this
  - computer
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
D﻿eare lezer,\
\
O﻿nlangs heb ik mijn Windows-versie op mijn MacBook Pro 16,1 BootCamp-installatie bijgewerkt naar Windows 11. Nu liep ik tegen het probleem aan dat mijn ingebouwde toetsenbord en trackpad niet meer werkten. Ik moest dit oplossen door een apart toetsenbord en muis aan te sluiten via USB.

I﻿k downloadde de software in het BootCamp-hulpprogramma op macOS die compatibel is met mijn laptop, in dit geval versie: Boot Camp-stuurprogramma's 6.1.6655. Maar bij het opstarten van setup.exe krijg ik de volgende foutmelding: This version of boot camp is not intended for this computer.

V﻿olg de onderstaande instructies om dit te omzeilen:

Installatie via de opdrachtregel

```

Navigeer naar de Boot Camp-map:

Open een opdrachtprompt met beheerdersrechten
# cd BootCamp\Drivers\Apple

Geef de inhoud weer ter bevestiging:
# dir

Forceer de installatie van de BootCamp-stuurprogramma's:
#msiexec /i BootCamp.msi
```

N﻿u start de installatiewizard van BootCamp-stuurprogramma's voor alle Apple-apparaten zonder de fatale fout die eerder verscheen.

G﻿eniet ervan

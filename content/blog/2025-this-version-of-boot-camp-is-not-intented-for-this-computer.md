---
title: This version of BootCamp is not intented for this computer
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
D﻿ear reader,\
\
R﻿ecently I updated my Windows version of my MacBook Pro 16,1 BootCamp setup to Windows 11. Now I ran into the problem that my build in keyboard and trackpad were not working anymore. I had to overcome this issue by connecting a separate keyboard and mouse on a USB port.

I﻿ downloaded the software in the BootCamp utility on macOS that is compatible with my laptop, in this case version: Boot Camp drivers 6.1.6655. But when trying to startup the setup.exe I get the following error: This version of boot camp is not intented for this computer.

T﻿o come around this follow the instructions below:

Installation via Command Line

```

Navigate to the Boot Camp directory:

Open a command prompt with administrator privileges 
# cd BootCamp\Drivers\Apple

List the contents to confirm:
# dir

Force install the BootCamp drivers:
#msiexec /i BootCamp.msi
```

N﻿ow it starts the BootCamp driver installation procedure for all the Apple devices without the fatal error it presented before.

E﻿njoy
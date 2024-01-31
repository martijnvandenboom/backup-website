---
title: Bash script met een SUCCES of FAILED melding aan het einde van de regel
date: 2024-01-31T20:18:39.918Z
draft: false
categories:
  - article
tags:
  - bash
  - script
  - succes
  - failed
  - melding
  - einde
  - regel
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
Z﻿ie hieronder een voorbeeld script om aan het einde van de regel helemaal rechts uitgelijnd een SUCCES melding in het groen of een FAILED melding in het rood te krijgen.

```
#!/bin/bash

# Set the message
success_message="Your command was successful"
failed_message="Your command failed"

# Set the "OK" string in green
ok="$(tput setaf 2)[SUCCES]$(tput sgr0)"
failed="$(tput setaf 1)[FAILED]$(tput sgr0)"

# Get the width of the terminal
term_width=$(tput cols)+9

# Calculate the number of dots needed
success_dots_count=$((term_width - ${#success_message} - ${#ok}))
failed_dots_count=$((term_width - ${#failed_message} - ${#failed}))

# Create a string of dots for success and failed messages
success_dots=$(printf "%0.s." $(seq 1 $success_dots_count))
failed_dots=$(printf "%0.s." $(seq 1 $failed_dots_count))

# Print the success message with dots and "OK" at the end of the line
printf "%s%s%s\n" "$success_message " "$success_dots" " $ok"

# Print the failed message with dots and "FAILED" at the end of the line
printf "%s%s%s\n" "$failed_message " "$failed_dots" " $failed"
```
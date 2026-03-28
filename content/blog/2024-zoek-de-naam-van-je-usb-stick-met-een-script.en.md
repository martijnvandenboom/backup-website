---
title: Find the name of your USB stick with a script
date: 2024-07-18T07:20:59.657Z
draft: false
categories:
  - article
tags:
  - zoek
  - naam
  - usb
  - stick
  - bash
  - script
author: ing. M.A.C.M. (Martijn) van den Boom
authorImage: uploads/Martijn_001.jpg
comments: true
share: true
---
You can use this script to retrieve the name of your USB stick.\
The name of your USB stick can be used in Apple's sudo command to create a USB installer.\
\
Step 1: Open the Terminal application\
Step 2: Go to your home directory, type: # cd\
Step 3: Optionally create a scripts directory, type: # mkdir scripts\
Step 4: Navigate to the newly created scripts directory, type: # cd scripts\
Step 5: Create a bash script, type: # vim usbstick.sh\
Step 6: Insert the following code:

```bash
#!/bin/bash

# Get list of all external physical disks
external_disks=$(diskutil list external physical | grep '^/dev/' | awk '{print $1}')

# Check if any were found
if [[ -z "$external_disks" ]]; then
  echo ""
  echo "No external USB sticks are connected!"
  echo ""
  exit 0
fi

echo ""
echo "==="
echo "External USB volumes:"

# Loop through each disk
for disk in $external_disks; do
  # Get all partitions for the disk
  partitions=$(diskutil list "$disk" | grep '^   [0-9]' | awk '{print $NF}')
  for part in $partitions; do
    # Get mount info
    mount_point=$(diskutil info "$part" | awk -F: '/Mount Point/ {gsub(/^ +| +$/, "", $2); print $2}')
    volume_name=$(diskutil info "$part" | awk -F: '/Volume Name/ {gsub(/^ +| +$/, "", $2); print $2}')
    fs_type=$(diskutil info "$part" | awk -F: '/Type \(Bundle\)/ {gsub(/^ +| +$/, "", $2); print $2}')

    # Only show if it's mounted
    if [[ -n "$mount_point" && "$mount_point" != "Not mounted" ]]; then
      echo "• Volume: $volume_name"
      echo "  Mount point: $mount_point"
      echo "  File system: $fs_type"
      echo ""
    fi
  done
done
```

\
Step 7: Make the script executable, type: # chmod +x usbstick.sh\
Step 8: Run the script, type: # ./usbstick.sh\
Step 9: Press: Enter\
Step 10: Below the 3 === characters the name of your USB stick will now appear\
Step 11: You can now substitute the volume name in Apple's sudo command

OR

Step 1: Open the Terminal application\
Step 2: Copy and paste the entire code block into the terminal

```bash
bash <<'EOF'
external_disks=$(diskutil list external physical | grep '^/dev/' | awk '{print $1}')

if [[ -z "$external_disks" ]]; then
  echo ""
  echo "No external USB sticks are connected!"
  echo ""
  exit 0
fi

echo ""
echo "==="
echo "External USB volumes:"

for disk in $external_disks; do
  partitions=$(diskutil list "$disk" | grep '^   [0-9]' | awk '{print $NF}')
  for part in $partitions; do
    mount_point=$(diskutil info "$part" | awk -F: '/Mount Point/ {gsub(/^ +| +$/, "", $2); print $2}')
    volume_name=$(diskutil info "$part" | awk -F: '/Volume Name/ {gsub(/^ +| +$/, "", $2); print $2}')
    fs_type=$(diskutil info "$part" | awk -F: '/Type \(Bundle\)/ {gsub(/^ +| +$/, "", $2); print $2}')

    if [[ -n "$mount_point" && "$mount_point" != "Not mounted" ]]; then
      echo "• Volume: $volume_name"
      echo "  Mount point: $mount_point"
      echo "  File system: $fs_type"
      echo ""
    fi
  done
done
EOF
```

Step 3: Press: Enter\
Step 4: Below the 3 === characters the name of your USB stick will now appear\
Step 5: You can now substitute the volume name in Apple's sudo command

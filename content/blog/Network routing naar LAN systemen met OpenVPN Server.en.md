+++
title = "Network routing to LAN systems with OpenVPN Server"
description = "To be able to reach the systems in het LAN network you will need to add a route"
author = "van den Boom"
date = 2025-11-15T15:40:22+01:00
tags = ["Network", "routing", "LAN", "systems", "OpenVPN", "Server"]
categories = ["windows", "linux", "macos", "tools", "utilities", "routing"]
+++

To be able to access systems on the LAN network through the VPN tunnel of the OpenVPN server, the LAN system must know that traffic destined for the VPN subnet must be sent via the OpenVPN server. Without this additional route, return traffic will not reach the VPN clients.

In this example, we use the subnet 10.0.8.0/24 as the IP range you have configured for the OpenVPN tunnel. This is the network in which all VPN clients receive an IP address. To ensure that a device on the LAN can correctly send traffic back to these VPN clients, you must add a static route on that LAN device.

Example (Windows):

`route add 10.0.8.0 MASK 255.255.255.0 <IP-of-the-OpenVPN-server>`


Replace <IP-of-the-OpenVPN-server> with the LAN address of the OpenVPN server (for example 192.168.1.10).

Sometimes it is also necessary to explicitly specify the network interface through which this route should be sent. This may be required when the system has multiple network adapters, or when Windows does not automatically select the correct interface. In that case, you add the interface number corresponding to the LAN port to which the OpenVPN server is connected:

`route add 10.0.8.0 MASK 255.255.255.0 <IP-of-the-OpenVPN-server> IF <interface-ID>`


You can find the interface ID via:

`route print`

To delete the route

`route delete 10.0.8.0`

After adding this (possibly interface-specific) route, the LAN system knows that all traffic to the tunnel network 10.0.8.0/24 must be sent via the OpenVPN server, ensuring that VPN clients are correctly reachable.
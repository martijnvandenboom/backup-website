+++
title = "JavaScript open browser tabs"
description = "JavaScript open browser tabs"
author = "van den Boom"
date = 2021-12-18T20:56:00+01:00
tags = ["javascript", "browser", "tab"]
categories = ["JavaScript"]
+++

{{< highlight html >}}

	function NewTabsMarktplaats() {
		window.open("https://www.marktplaats.nl/q/sony+stereo/", "__blank");
		window.open("https://www.marktplaats.nl/q/sony+stereo+set/", "Second Tab");
	}

	function NewTabsEbay() {
		window.open("https://www.ebay.nl/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=sony+stereo&_sacat=0", "__blank");
		window.open("https://www.ebay.nl/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=sony+stereo+set&_sacat=0&LH_TitleDesc=0&_odkw=sony+stereo&_osacat=0", "Second Tab");
	}

{{< /highlight >}}

   <p>Click the button to open new tabs </p>
  
    <button onclick="NewTabsMarktplaats()">
        Open Marktplaats Tabs
    </button></br>
    </br>
    <button onclick="NewTabsEbay()">
        Open Ebay Tabs
    </button>

    <script>
        const request = indexedDB.open("notes")

        request.onupgradeneeded = e => {
            alert("upgrade is called")
        }

        request.onsuccess = e => {
            alert("success is called")
        }

        request.onerror = e => {
            alert("error !")
        }

        function NewTabsMarktplaats() {
            window.open("https://www.marktplaats.nl/q/sony+stereo/", "__blank");
            window.open("https://www.marktplaats.nl/q/sony+stereo+set/", "Second Tab");
        }

        function NewTabsEbay() {
            window.open("https://www.ebay.nl/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=sony+stereo&_sacat=0", "__blank");
            window.open("https://www.ebay.nl/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=sony+stereo+set&_sacat=0&LH_TitleDesc=0&_odkw=sony+stereo&_osacat=0", "Second Tab");
        }

    </script>
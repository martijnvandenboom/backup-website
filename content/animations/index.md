+++
title = "Animaties"
description = "Animatie creatie"
author = "van den Boom"
date = "2025-02-11"
layout = "animaties"
categories = ["animaties"]
tags = ["animatie", "css", "javascript", "webdesign"]
comments = false
+++

<b><a rel="noopener" href="#creating_animations">Animatie creatie service</a></b></br>

<a id="creating_animations"></a>
</br>
</br>

<b>Animatie creatie service</b>

Breng je ideeën tot leven met verbluffende animaties

Bij "van den <span class="bold-rotate">B</span>oom Animations" zijn we gespecialiseerd in het creëren van op maat gemaakte animaties die je publiek boeien en engageren. Of je nu je website wilt verbeteren, je merk wilt adverteren of een oogverblindend effect aan je project wilt toevoegen, ons team staat klaar om jouw visie om te zetten in beweging. Van soepele overgangen en dynamische visuals tot aantrekkelijke animaties, wij bieden op maat gemaakte oplossingen om jouw content te laten opvallen. Laat ons je helpen je verhaal te vertellen door de magie van animatie!

<u>Wat wij aanbieden:</u>

Wij bieden we een breed scala aan animatiediensten die aansluiten bij iedere behoefte. Of je nu op zoek bent naar dynamische website-animaties, boeiende social media visuals of motion graphics voor je volgende videoproject, wij hebben alles in huis. Onze expertise omvat alles van logo-animaties tot 2D/3D motion graphics. We werken nauw met je samen om op maat gemaakte animaties te creëren die passen bij jouw merk, stijl en doelstellingen, zodat je boodschap op de meest boeiende manier wordt overgebracht.

<u>Hoe het werkt:</u>

Het starten met ons is simpel en probleemloos. Eerst hebben we een gesprek om je visie, projectdoelen en de animatiestijl die je zoekt te begrijpen. Vervolgens zal ons creatieve team een concept op maat maken en je eerste ontwerpen of storyboards delen. Zodra je tevreden bent met de richting, gaan we verder met de productie, waarbij we de animatie tot leven brengen met oog voor detail en kwaliteit. Gedurende het proces houden we je op de hoogte met regelmatige updates, zodat het eindresultaat je verwachtingen overtreft. Van begin tot eind zorgen wij ervoor dat je animatie-ervaring soepel en plezierig is.br>
</br>

Vriendelijke groeten,

Martijn</br>
</br>

P.S.</br>
Let op: Deze service is gebaseerd op de bijdragen die door beide partijen zijn overeengekomen. Als wij je succesvol uitstekende service bieden en je tevreden bent met het resultaat, zouden we het zeer op prijs stellen om positieve feedback te ontvangen die we publiekelijk kunnen tonen en opnemen in ons portfolio.</br>
</br>
</br>

<b><a rel="noopener" href="#creating_animations">Animatie creatie service</a></b></br>

Voorbeelden:</br>

<div class="name-container">
    1. De roterende letter: </br>
    "van den <span class="bold-rotate">B</span>oom Animations" deze roterende letter "B" is één van de eerste ideeën die bij me opkwam toen ik begon met het verkennen van de wereld van webdesign en animaties. Een website vind ik veel vermakelijker en levendiger door deze kleine, maar krachtige aandachtspunten – de animaties die de gebruiker verrassen en de ervaring verrijken. Het toevoegen van subtiele bewegingen, zoals het laten draaien van een element of het laten oplichten van een afbeelding, zorgt voor een dynamischere en aantrekkelijkere website. Mijn doel is om die magie te brengen, zodat elke website die wij maken net dat beetje extra heeft, iets wat de bezoekers niet alleen opmerken, maar ook waarderen.
</div></br>
</br>

<div class="flame-container">
    <div class="left-div">2. Het brandend vlammetje:</br>
        Onze vlamanimatie symboliseert de brandende creativiteit die we in elk project stoppen. Zoals een vlam die constant danst en verandert, geven wij jouw ideeën energie en beweging. Of je nu een dynamisch element voor je website zoekt of een visueel effect dat de aandacht vasthoudt, onze vlammen brengen jouw project naar een hoger niveau. Kijk hoe de vlam oplicht en beweegt, net zoals onze creatieve processen!
    </div>
    <div class="right-div">
        <img src="/images/flame-image-003.png" alt="Flame" class="flame">
    </div>

</div></br>
</br>

<style>
    .company_logo {
        font-family: "DejaVu Sans Mono", monospace;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 18px;
        margin-bottom: 8px;
    }
    .prefix-container {
        width: 7ch;
        display: flex;
        align-items: center;
    }
    .logo-right {
        margin-left: 20px;
        color: #000000;
    }
    #cursor {
        animation: blink 1s step-end infinite;
        color: #000000;
    }
    @keyframes blink {
        from, to { opacity: 1; }
        50% { opacity: 0; }
    }
</style>

<div>3. Het bedrijfslogo:</br>
    Ons bedrijfslogo is zelf een levende animatie. De tekst <code>&lt;VDB/&gt;</code> wordt karakter voor karakter ingetypt — als een developer die code schrijft — gevolgd door een rustig knipperend cursortje. Na een korte pauze begint het proces opnieuw, als een eindeloze reminder dat wij altijd bezig zijn iets nieuws te bouwen. De combinatie van de programmeertaal-syntaxis en de monospace typografie weerspiegelt precies wie wij zijn: een technisch bedrijf dat creativiteit en vakmanschap samenbrengt in elke oplossing die we leveren.
</div>

<div class="company_logo">
    <div class="prefix-container">
        <span id="typed"></span><span id="cursor">_</span>
    </div>
    <div>
        <span id="static" class="logo-right">Digital Services</span>
    </div>
</div>

<script>
const text = "<VDB/>";
const typedElement = document.getElementById("typed");
let i = 0;

function startAnimation() {
    typedElement.textContent = "";
    i = 0;
    setTimeout(typeNext, 4000);
}

function typeNext() {
    if (i < text.length) {
        typedElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeNext, 120);
    } else {
        setTimeout(startAnimation, 8000);
    }
}

startAnimation();
</script>
</br>
</br>
</br>
</br>
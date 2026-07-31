+++
title = "Animations"
description = "Creating animations"
author = "van den Boom"
date = "2025-02-11"
layout = "animations"
categories = ["animations"]
tags = ["animation", "css", "javascript", "webdesign"]
comments = false
+++

<b><a rel="noopener" href="#creating_animations">Creating animations service</a></b></br>

<b>Creating animations service</b>

Bring Your Ideas to Life with Stunning Animations

At "van den <span class="bold-rotate">B</span>oom Animations", we specialize in crafting custom animations that captivate and engage your audience. Whether you're looking to enhance your website, advertise your brand, or add an eye-catching effect to your project, our team is here to transform your vision into motion. From smooth transitions and dynamic visuals to attractive animations, we offer tailored solutions to make your content stand out. Let us help you tell your story through the magic of animation!

<u>What We Offer:</u>

We offer a wide range of animation services to suit every need. Whether you're looking for dynamic website animations, engaging social media visuals, or motion graphics for your next video project, we’ve got you covered. Our expertise includes everything from logo animations to 2D/3D motion graphics. We work closely with you to create custom animations that align with your brand, style, and goals, ensuring your message is delivered in the most captivating way possible.

<u>How It Works:</u>

Getting started with us is simple and hassle-free. First, we’ll have a conversation to understand your vision, project goals, and the animation style you're looking for. Then, our creative team will craft a concept tailored to your needs and share initial designs or storyboards. Once you’re happy with the direction, we move into production, where we bring the animation to life with attention to detail and quality. Throughout the process, we keep you involved with regular updates, ensuring the final result exceeds your expectations. From start to finish, we’re here to make your animation experience smooth and enjoyable.</br>
</br>

Best regards,

Martijn</br>
</br>

P.S.</br>
Please note: This service is based on the contributions agreed upon by both parties. If we successfully provide you with excellent service and you are satisfied with the outcome, we would greatly appreciate positive feedback that we can showcase publicly and include in our portfolio.</br>
</br>
<a id="creating_animations" class="anchor-scroll-offset"></a>

<b><a rel="noopener" href="#creating_animations">Creating animations service</a></b></br>

Examples:</br>

<div class="name-container">
    1. The rotating letter: </br>
    "van den <span class="bold-rotate">B</span>oom Animations" this rotating letter "B" is one of the first ideas that came to me when I started exploring the world of web design and animations. A website can become much more entertaining and lively through these small yet powerful details – the animations that surprise the user and enrich the experience. Adding subtle movements, such as rotating an element or making an image glow, creates a more dynamic and engaging website. My goal is to bring that magic, so every website we create has that little extra touch, something that visitors not only notice but also appreciate.
</div></br>
</br>

<div class="flame-container">
    <div class="left-div">2. The burning flame:</br>
        Our flame animation symbolizes the burning creativity that we put into every project. Just like a flame that constantly dances and changes, we give your ideas energy and movement. Whether you're looking for a dynamic element for your website or a visual effect that captures attention, our flames elevate your project to the next level. Watch how the flame lights up and moves, just like our creative processes!
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

    .hugo-animation-container {
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
    }

    .hugo-animation-container .left-div {
        flex: 1;
        min-width: 220px;
    }

    .hugo-animation-container .right-div {
        flex: 0 0 220px;
        height: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .hugo-circle-container {
        position: relative;
        width: 200px;
        height: 200px;
    }

    /* Wrapper div rotates — more reliable than animating the SVG itself */
    .hugo-circle-container .hugo-rotating-ring {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        transform-origin: 50% 50%;
        animation: hugo-rotate-circle 18s linear infinite;
    }

    .hugo-circle-container .hugo-rotating-ring > svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    .hugo-circle-container .hugo-rotating-ring text {
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        font-size: 7.2px;
        font-weight: 600;
        letter-spacing: 0.4px;
        fill: currentColor;
        text-transform: none;
    }

    .hugo-logo-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 92px;
        z-index: 1;
        pointer-events: none;
    }

    .hugo-logo-center img {
        display: block;
        width: 100%;
        height: auto;
    }

    @keyframes hugo-rotate-circle {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
        .hugo-circle-container .hugo-rotating-ring {
            animation: none;
        }
    }
</style>

<div>3. The company logo:</br>
    Our company logo is itself a living animation. The text <code>&lt;VDB/&gt;</code> is typed out character by character — like a developer writing code — followed by a gently blinking cursor. After a brief pause, the sequence starts over, a constant reminder that we are always building something new. The combination of programming-language syntax and monospace typography reflects exactly who we are: a technical company that brings creativity and craftsmanship together in every solution we deliver.
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

<div class="hugo-animation-container">
    <div class="left-div">4. The rotating Hugo circle:</br>
        This animation showcases our expertise with Hugo, the fast static site generator we use to build modern websites. At the center sits the official Hugo logo. Around it, the gohugo.io site icon rides along with the rotating text: <em>Hugo · static site generator · Written in Golang</em> — a nod to the Go language Hugo is written in, and to the continuous motion of the web.
    </div>
    <div class="right-div">
        <div class="hugo-circle-container" aria-label="Hugo rotating logo animation">
            <div class="hugo-logo-center">
                <img src="/images/hugo-logo-wide.svg" alt="Official Hugo logo" width="92" height="24" loading="lazy">
            </div>
            <div class="hugo-rotating-ring">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="presentation">
                    <defs>
                        <path id="hugoCirclePath" fill="none" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"/>
                    </defs>
                    <!-- gohugo.io favicon: positioned on the path, tilted 90° clockwise to sit with the text -->
                    <g transform="translate(10 50) rotate(90)">
                        <image href="/images/hugo-favicon.png" xlink:href="/images/hugo-favicon.png" x="-5.5" y="-5.5" width="11" height="11" preserveAspectRatio="xMidYMid meet"/>
                    </g>
                    <text>
                        <textPath href="#hugoCirclePath" xlink:href="#hugoCirclePath" startOffset="14%">Hugo · static site generator · Written in Golang ·</textPath>
                    </text>
                </svg>
            </div>
        </div>
    </div>
</div></br>
</br>


</br>
+++
title = "Emoji-ondersteuning"
description = "Handleiding voor het gebruik van emoji in Hugo"
author = "Hugo Authors"
date = "2019-03-05"
tags = ["emoji"]
[[images]]
  src = "https://vandenboom.netlify.app/img/2019/03/pic02.jpg"
  alt = "Desert Scene"
  stretch = "stretchH"
+++

Emoji kan op verschillende manieren worden ingeschakeld in een Hugo-project.
<!--more-->
De functie [`emojify`](https://gohugo.io/functions/emojify/) kan rechtstreeks worden aangeroepen in sjablonen of [Inline Shortcodes](https://gohugo.io/templates/shortcode-templates/#inline-shortcodes).

Om emoji globaal in te schakelen, stelt u `enableEmoji` in op `true` in de [configuratie](https://gohugo.io/getting-started/configuration/) van uw site, waarna u emoji-afkortingen rechtstreeks in inhoudsbestanden kunt typen; bijv.


<p><span class="nowrap"><span class="emojify">🙈</span> <code>:see_no_evil:</code></span>  <span class="nowrap"><span class="emojify">🙉</span> <code>:hear_no_evil:</code></span>  <span class="nowrap"><span class="emojify">🙊</span> <code>:speak_no_evil:</code></span></p>
<br>

Het [Emoji-spiekbriefje](http://www.emoji-cheat-sheet.com/) is een handig naslagwerk voor emoji-afkortingen.

***

**N.B.** De bovenstaande stappen schakelen Unicode-standaard emoji-tekens en -reeksen in Hugo in, maar de weergave van deze glyphs hangt af van de browser en het platform. Om de emoji op te maken kunt u een emoji-lettertype van derden of een lettertypestapel gebruiken; bijv.

{{< highlight html >}}
.emoji {
font-family: Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols;
}
{{< /highlight >}}

{{< css.inline >}}
<style>
.emojify {
	font-family: Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,Segoe UI Symbol,Android Emoji,EmojiSymbols;
	font-size: 2rem;
	vertical-align: middle;
}
@media screen and (max-width:650px) {
    .nowrap {
	display: block;
	margin: 25px 0;
}
}
</style>
{{< /css.inline >}}

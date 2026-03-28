+++
title = "Markdown-syntaxgids"
description = "Voorbeeldartikel met basisopmaak voor Markdown en HTML-elementen."
author = "Hugo Authors"
date = "2019-03-11"
tags = ["markdown", "css", "html", "themes"]
categories = ["themes", "syntax"]

+++

Dit artikel biedt een overzicht van de basisopmaak van Markdown die kan worden gebruikt in Hugo-inhoudsbestanden, en toont ook hoe basale HTML-elementen worden opgemaakt met CSS in een Hugo-thema.
<!--more-->

## Koppen

De volgende HTML `<h1>`—`<h6>` elementen vertegenwoordigen zes niveaus van sectiekoppen. `<h1>` is het hoogste niveau en `<h6>` het laagste.

# H1
## H2
### H3
#### H4
##### H5
###### H6

## Alinea

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Blokcitaten

Het blokcitaat-element vertegenwoordigt inhoud die is geciteerd uit een andere bron, optioneel met een vermelding die binnen een `footer`- of `cite`-element moet staan, en optioneel met inline wijzigingen zoals annotaties en afkortingen.

#### Blokcitaat zonder toewijzing

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.
> **Let op** dat u *Markdown-syntaxis* kunt gebruiken in een blokcitaat.

#### Blokcitaat met toewijzing

> Don't communicate by sharing memory, share memory by communicating.</p>
> — <cite>Rob Pike[^1]</cite>

[^1]: Het bovenstaande citaat is afkomstig uit de [lezing](https://www.youtube.com/watch?v=PAAkCSZUG1c) van Rob Pike tijdens Gopherfest, 18 november 2015.

## Tabellen

Tabellen maken geen deel uit van de kern-Markdown-specificatie, maar Hugo ondersteunt ze standaard.

   Naam | Leeftijd
--------|------
    Bob | 27
  Alice | 23

#### Inline Markdown in tabellen

| Inline&nbsp;&nbsp;&nbsp;     | Markdown&nbsp;&nbsp;&nbsp;  | In&nbsp;&nbsp;&nbsp;                | Tabel      |
| ---------- | --------- | ----------------- | ---------- |
| *cursief*  | **vet**  | ~~doorhalen~~&nbsp;&nbsp;&nbsp; | `code`     |

## Codeblokken

#### Codeblok met backticks

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example HTML5 Document</title>
</head>
<body>
  <p>Test</p>
</body>
</html>
```
#### Codeblok ingesprongen met vier spaties

    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Example HTML5 Document</title>
    </head>
    <body>
      <p>Test</p>
    </body>
    </html>

#### Codeblok met Hugo's interne highlight-shortcode
{{< highlight html >}}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example HTML5 Document</title>
</head>
<body>
  <p>Test</p>
</body>
</html>
{{< /highlight >}}

## Lijsttypen

#### Geordende lijst

1. Eerste item
2. Tweede item
3. Derde item

#### Ongeordende lijst

* Lijstitem
* Nog een item
* En nog een item

#### Geneste lijst

* Item
    1. Eerste subitem
    2. Tweede subitem

## Overige elementen — abbr, sub, sup, kbd, mark

<abbr title="Graphics Interchange Format">GIF</abbr> is een bitmap-afbeeldingsformaat.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Druk op <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd> om de sessie te beëindigen.

De meeste <mark>salamanders</mark> zijn nachtdieren en jagen op insecten, wormen en andere kleine dieren.

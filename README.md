Respondu
==

A cross browser platform for creating Responsive techniques





Features
===

* Relatively Unintrustive
* Entirely client side
* Gracefully Degrades for non-JS clients (e.g. search bots)
* Create your own responsive techniques!
* Forward looking - simple feature detection will cause it to become easily compatible with future browsers

How To Use
===

```html
<!DOCTYPE HTML>
<html>
<head>
<script src=R.js></script>
</head>
<body>

<script>window['#R']('picture');</script>
<noscript>

<img src="/images/responsive.jpg">

</noscript>
</body>
</html>

```

*Don't put closing </script> tags inside <noscript> tags! This will ruin EVERYTHING*

Instead use a self closing syntax  (*TODO*)

```html
<script src=path_to_my_script />
```

This isn't supported in browsers, but Respondu supports (*TODO*) it to sidestep the whole </script> in <noscript> issue

How It Works
===

Look at teh codez :D


Browsers Confirmed as Working
===

* Chrome
* IE 8
* Firefox
* iOS Safari

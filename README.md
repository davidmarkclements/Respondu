Respondu 0.0.1alpha
==

A cross browser platform for implementing and creating Responsive techniques



Features
===

* Relatively Unintrustive
* Entirely client side
* **DEFERS SRC LOADING TILL PROCESSING IS FINISHED!**
* Gracefully Degrades for non-JS clients (e.g. search bots)
* Very gentle on the global scope
* Create your own responsive techniques (implementations)!
* Forward looking - simple feature detection will cause it to become easily compatible with future browsers

Basic Use
===

```html
<!DOCTYPE HTML>
<html>
<head>
<script src=R.js></script>
</head>
<body>

<script>window['#R']();</script>
<noscript>

<img src="/images/responsive.jpg">

</noscript>
</body>
</html>

```

This will apply the default breakpoints

```javascript
breakpoints: {
        typical: 500, //typical will leave src unchanged
        medium : 1000, //configurable properties, will be reflected in requested image e.g. name.medium.png
        large : Infinity //largest size set to infinity
      }
```

Setting Breakpoints
===
Break points can be set thusly

```html
<script>window['#R']({breakpoints: {
  typical:300, 
  small: 500, 
  medium: 1200, 
  large: 1500,
  x-large: Infinity}});</script>
```

Using Implementations
===
Respondu also provides an implementations system,
it currently has the picture implementation. 

To use do something like

```html
<!DOCTYPE HTML>
<html>
<head>
<script src=R.js></script>
</head>
<body>

<script>window['#R']('picture');</script>
<noscript>
<picture alt="Alt tag describing the image represented"> 
    <source src="photo-s.jpg"/> 
    <source src="photo-s@2x.jpg" media="-webkit-min-device-pixel-ratio:2,-moz-min-device-pixel-ratio:2,-o-min-device-pixel-ratio: 2/1,min-device-pixel-ratio:2"/> 

    <source src="photo-m.jpg" media="min-width:321px"/> 
    <source src="photo-m@2x.jpg" media="min-width:321px and -webkit-min-device-pixel-ratio:2,-moz-min-device-pixel-ratio:2,-o-min-device-pixel-ratio: 2/1,min-device-pixel-ratio:2"/> 

    <source src="photo-l.jpg" media="min-width:641px"/> 
    <source src="photo-l@2x.jpg" media="min-width:641px and -webkit-min-device-pixel-ratio:2,-moz-min-device-pixel-ratio:2,-o-min-device-pixel-ratio: 2/1,min-device-pixel-ratio:2"/> 

    <source src="photo-xl.jpg" media="min-width:1281px" /> 
    <source src="photo-xl@2x.jpg" media="min-width:1281px and -webkit-min-device-pixel-ratio:2,-moz-min-device-pixel-ratio:2,-o-min-device-pixel-ratio: 2/1,min-device-pixel-ratio:2" /> 
    <img src="photo-s.jpg" />
</picture>
</noscript>
</body>
</html>

```

Creating an Implementation
===
We create an implementation by adding it to the window['#R'] prototype, 
the format for creating an implementation is:

```javascript
  _w['#R'].prototype.MyNewImplementation = function (doc, done) {
    // all your code here
    done();
  }

```

The `doc` parameter is a DOM object (but not the actual DOM)
We `done` paremeter is called as a function when processing is complete 
(using the `done` callback function allows for any async stuff)

As an example, here's how we implement picture:

```javascript
  window['#R'].prototype.picture = function (doc, done) {
      var pictures = (doc.getElementsByTagName('picture')), pic, imgAlt, sources, src, i, c,
        media, minWidth, imgSrc, img,  sW = _w.screen.width, , pixelRatio, 
        pr = _w.devicePixelRatio;
                
      pr = pr || 1; //set devices pixel ratio;
      
      for(i = 0; i < pictures.length; i++) {
        pic = pictures[i];
        imgAlt = pic.getAttribute('alt');
        sources = pic.getElementsByTagName('source');
          for(c = 0; c < sources.length; c++) {
            src = sources[c];
            media = src.getAttribute('media'); //grab the alt
           
            if (media) {
              minWidth = media.match(/min-width:([0-9]+)px/);
              minWidth = minWidth ? minWidth[1] : 0; //get min-width media query for each source element
              
              pixelRatio = media.match(/min-device-pixel-ratio:([0-9]+)/); //get min-device-pixel-ratio
              pixelRatio = pixelRatio ? pixelRatio[1] : 1; 
                            
              if (minWidth < sW && pr === pixelRatio) { imgSrc = src; } //set imgSrc to the source element if conditions match
            }
          }
        img = doc.createElement('img'); //create a new image element on the ghost DOM
        img.src = imgSrc.getAttribute('src'); //set chosen src
        img.alt = imgAlt; //set alt
        
        pic.parentNode.replaceChild(img, pic); //replace picture element with create img element
      }
      
      
      done(); //finished.
    }

```



We could then use it with
```html
<script>window['#R']('MyNewImplementation');</script>
```





*Don't put closing &lt;script&gt; tags inside &lt;noscript&gt; tags! This will ruin EVERYTHING*

Instead use a self closing syntax  (*TODO*)

```html
<script src=path_to_my_script />
```

This isn't supported in browsers, but Respondu supports (*TODO*) it to sidestep the whole &lt;/script&gt; in &lt;noscript&gt; issue

How It Works
===

Look at teh codez :D


Browsers Confirmed as Working
===

* Chrome
* IE 8
* Firefox
* iOS Safari

Issues
===
* doesn't work well with $(document).ready et. al., since dom is ready before we insert code
* If scripts are placed after the noscript tag, they will be executed before the content has loaded
* The current solution is to place scripts that parse DOM elements at the end of noscript tag, but `</script>` end tags break the functionality
* Therefore scripts with src'es shall be included with `<script src='blah' />` INSIDE the `<noscript>` tags **TODO**
* Inline scripts in the body, well, I haven't worked inline scripts out yet. 



Todo
===

* implement faux document ready event
* self closing script syntax
* Tidy & optimize
* create more implementations
* testing in more browsers
* working examples
* explain how it works properly
* explain the callback functionality
* rethink the name (suggestions?)



Contributing
===
I warmly welcome all contributions, you can help by

* testing
* pull requests
* suggesting a name




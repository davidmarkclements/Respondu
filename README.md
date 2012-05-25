Respondu 0.0.1
==

A cross browser platform for implementing and creating gracefully degrading Responsive techniques

Features
===

* Relatively Unintrustive
* Entirely client side
* **DEFERS SRC LOADING TILL PROCESSING IS FINISHED!**
* Gracefully Degrades for non-JS clients (e.g. search bots)
* Very gentle to the global scope
* Create your own responsive techniques (implementations)!
* Forward looking - simple feature detection (once we know how to detect) will cause it to become easily compatible with future browsers
* ** Now works seamlessly with jQuery's $(document).ready! **

Inclusive Implementations 
===

* picture
* srcset
* pure javascript (breakpoints object)

Examples
===

Examples can be found at [http://respondu.davidmarkclements.com](http://respondu.davidmarkclements.com)


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

</noscript></style>
</body>
</html>

```

The end tags `</noscript></style>` are essential for Respondu to operate in certain browsers (Safari, IE8)
and to block the img src's from loading prior to responsive processing. 

The positioning of the window['#R'] call in the body, just before the noscript tag is also essential. See How It Works. 

Basic usage will apply the default breakpoints

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
it currently includes the picture and srcset implementations. 

For picture we would do something like

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
</noscript></style>
</body>
</html>
```

For srcset we could do

```html
<!DOCTYPE HTML>
<html>
<head>
<style>img {width:100%} /* use fluid layouts :) */</style>
<script src=js/R.js></script>
</head>
<body>

<script>window['#R']('srcset');</script>
<noscript>

<img src="images/photo.jpg" srcset="images/photo.small.jpg 320w, images/photo.small@2x.jpg 320w 2x, images/photo.medium.jpg 640w, images/photo.medium@2x.jpg 640w 2x, images/photo.large.jpg 1280w, images/photo.large@2x.jpg 1280w 2x, images/photo.xlarge.jpg 20000w, images/photo.xlarge@2x.jpg 20000w x2">

</noscript></style>

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
The `done` paremeter is called as a function when processing is complete 
(using the `done` callback function allows for any async stuff)

As an example, here's how we could implement picture (already included):

```javascript
      window['#R'].prototype.picture = function (doc, done) {
    
    
      var pictures = (doc.getElementsByTagName('picture')), pic, attrs, sources, src, i, c,
        media, minWidth, imgSrc, img, sW = _w.screen.width,  pixelRatio, 
        pr = _w.devicePixelRatio || 1;//set devices pixel ratio;
                
      
      for(i = 0; i < pictures.length; i++) {
        pic = pictures[i];
        attrs = pic.attributes;
        sources = pic.getElementsByTagName('source');
          for(c = 0; c < sources.length; c++) {
            src = sources[c];
            media = src.getAttribute('media'); 
                        
            if (media) {
              minWidth = media.match(/min-width:([0-9]+)px/);
              minWidth = minWidth ? minWidth[1] : 0; //get min-width media query for each source element
              
              pixelRatio = media.match(/min-device-pixel-ratio:([0-9]+)/); //get min-device-pixel-ratio
              pixelRatio = pixelRatio ? pixelRatio[1] : 1; 
                            
              if (minWidth < sW && pr === pixelRatio) { imgSrc = src; } //set imgSrc to the source element if conditions match
            }
          }
        
        if (imgSrc) {
          img = doc.createElement('img'); //create a new image element on the ghost DOM

          img.setAttribute('src', imgSrc.getAttribute('src'));
                  
          for(c = 0; c < attrs.length; c++) {
           img.setAttribute(attrs[c].nodeName, attrs[c].nodeValue);        
          }
          
          
          pic.parentNode.replaceChild(img, pic); //replace picture element with create img element
        }
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
Wrapping content in `<noscript>` tags stops it from being added to the DOM, whilst also providing complete content to non-js clients (such as
search engine bots, screen readers, text browsers). 
On some browsers its possible to extract and process the content of the `<noscript>` tags using normal methods (e.g. getElementById etc.) 
Other browsers (IE, Safari) however, actually remove the content of the noscript tags as soon as the Javascript engine initializes. 
So Respondu uses a hack to to ensure the content can be extracted from all browsers.

We do this by dynamically wrapping the `<noscript>` tags in another context - there are several ways: comments, textareas, script tags, style tags...

After experimentation and thought, Respondu's chosen way is to wrap the `<noscript>` tags with `<style>` tags, this seems to be the least invasive.

So once the script on the page has executed we end up with `<style type="text/responsive"><noscript>#content#</noscript></style>`, this prevents the content in the
noscript tags from being removed, and allows us to extract the contents from the noscript tags. 

As a result, any inline styles in the body (..which are really unneccessary and sub-optimal) should be included with `<css>` tags instead of `<style>`
tags, e.g.

```
<script>window['#R']();</script>
<noscript>
content etc.
<css>
  #silly {color:blue}
</css>
</noscript></style>
```

Respondu will parse the css tags, and convert them to style tags. 
It's really just best to avoid inline styles if you can.

Once the noscript content has been extracted, Respondu loads it into a "ghost DOM". (see [createHTMLDocument](https://developer.mozilla.org/en/DOM/DOMImplementation.createHTMLDocument))
The ghost DOM doesn't load any src's. We can manipulate this ghost DOM as the `doc` parameter when creating implementations (see [Creating an Implementation](#creating-an-implementation))

Once all changes have been made to our ghost document (e.g. when we've replaced img src's according to screen width), we load it into the real document

Body Scripts
===
If we want to have scripts execute once the DOM has loaded, the best place for them (if possible) is usually just before the closing `</body>` tag.
If you're using Respondu, you want them to be just before the closing `</noscript></style>` tags, Respondu will then ensure they are loaded and executed
after all the content has loaded. 

```
<body>
<script>window['#R']();</script>
<noscript>
content etc.

<script src=myScriptWhichWillManipulateTheDocument.js></script>
</noscript></style>
</body>
```

doclate
===
If you're using jQuery, and absolutely need to include scripts in the head but you're using $(document).ready
to defer execution until the DOM has loaded then Respondu can accomodate you. 

Just include doclate.js in yourheader, 


Browsers Confirmed as Working
===

* Chrome
* IE 8
* IE 9
* Firefox
* iOS Safari
* Safari (win)
* Opera

Issues
===
* doesn't (yet) work well with $(document).ready et. al., since dom is ready before we insert code
* If scripts are placed after the noscript tag, they will be executed before the content has loaded
* The current solution is to place scripts that parse DOM elements at the end of noscript tag, but `</script>` end tags break the functionality
* Therefore scripts with src'es shall be included with `<script src='blah' />` INSIDE the `<noscript>` tags **TODO**
* Inline scripts in the body, well, I haven't worked inline scripts out yet. 



Todo
===

* implement faux document ready event
* Tidy & optimize
* testing in more browsers
* working examples
* explain the callback functionality
* rethink the name (suggestions?)



Contributing
===
I warmly welcome all contributions, you can help by

* testing
* pull requests
* issues
* suggesting a name

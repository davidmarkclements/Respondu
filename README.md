Respondu 0.0.4
==

A cross browser platform for implementing and creating gracefully degrading Responsive techniques


New Features in 0.0.4
===
* Full uncustomized R.js minified and gzipped weighs at *2.8kb*
  * This can be reduced with custom builds - e.g. just including picture and not srcset brings us down to 2.4kb
* Picture updated to new syntax according to [proposed spec]http://dvcs.w3.org/hg/html-proposals/raw-file/tip/responsive-images/responsive-images.html)
* API changes
  * New plugin API for creating plugins of implementations
  * changed `Respondu()` to simply `Respondu()`
* New hack method: instead of `<noscript></noscript></style>` Respondu now uses `<noscript></noscript-->`
  * The closing `</noscript-->` *must* have the two dashes for cross browser compatibility
  * *Warning* Do not use `<!-- -->` (comment tags) inside the `<noscript>` tag*
    * This will break the functionality some browsers (ie, safari)
    * If you wish to make comments within the noscript tags use `<script>/*comment here*/</script>`
* Behavioural changes
  * Instead of putting all content in `<noscript>` tags, only relevant content (such as a picture element) goes inside a noscript tag
  * The call to Respondu isolates the following `<noscript></noscript-->` tag, processes the code and reinserts it in the place where Respondu is called
  * This leads to a more familiar, progressive loading experience
  * It also means R.base has been trimmed down, there's no need for loadScripts, doclate, window.open hackarounds etc
    * Infrastructure examples have been removed, since this functionality is no longer needful
  * Any scripts should go outside the noscript tag, the contents of the noscript tags should only be for assets you wish to responsively select the source for
* Stronger compatibility for source elements
  * It turns out some browsers *cough* iOS Safari *cough* sometimes strip source tags unless they're in a video element, this is secured against
* Picture/srcset now check for a browser implementation before processing (i.e. Respondu can now be used as a polyfill)
* Includes matchMedia polyfill for use in plugin implementations (and could be used anywhere in a project)


TODO for 0.0.5
===
  * Needs retesting in browsers
  * Improve picture further
  * Get picture media attributes working with em's

New Features in 0.0.3
===
* Standardisation of picture element has made hybrid solution inaccurate/reduntant so hybrid has been removed, picture will be updated in 0.0.4
* Now includes grunt.js file to automatically build R.js
* Customized builds available in the builds folder
* Future version will have a builder gui for fine grain control


New Features in 0.0.2
===
* Now supports IE8 + IE7
* Intelligently triggers window.onload and $(window).load in IE7/8/9
* Improved code base
* Modularized code for great customisation
  * R.base provides [basic use](#basic-use)
  * R.srcset, R.picture, and R.hybrid can be combined with R.base to become a polyfill for the respective implementation
  * Combine with doclate for seamless jQuery compatability


Features
===

* Relatively Unintrustive
* Entirely client side
* **DEFERS SRC LOADING TILL PROCESSING IS FINISHED!**
* Gracefully Degrades for non-JS clients (e.g. search bots)
* Very gentle to the global scope
* Create your own responsive techniques (implementations)!
* Forward looking - simple feature detection (once we know how to detect) will cause it to become easily compatible with future browsers
* **Now works seamlessly with jQuery's $(document).ready!**

Inclusive Implementations 
===

* [picture](#picture)
* [srcset](#srcset)
* [pure javascript](#basic-use) (breakpoints object)

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

<script>Respondu();</script>
<noscript>

<img src="/images/responsive.jpg">

</noscript-->
</body>
</html>

```

The end dashes in `</noscript-->` are essential for Respondu to operate in certain browsers (Safari, IE8)
and to block the img src's from loading prior to responsive processing. 

The positioning of the Respondu call in the body, just before the noscript tag is also essential. See How It Works. 

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
<script>Respondu({breakpoints: {
  typical:300, 
  small: 500, 
  medium: 1200, 
  large: 1500,
  x-large: Infinity}});</script>
```

Using Implementations
===
Respondu also provides an implementations system,
it currently includes the picture and srcset implementations plus the new hybrid implementation which combines the best of both. 

## picture

For picture we would do something like

```html
<!DOCTYPE HTML>
<html>
<head>
<link href='css/style.css' rel='stylesheet' type='text/css'>
<script src=R.js></script>
</head>
<body>

<script>Respondu('picture');</script>
<noscript>
<picture id=thepic> 
    <source srcset="images/photo.small.jpg 1x, images/photo.small.jpg 2x">
    <source media="(min-width:320px)" srcset="images/photo.medium.jpg 1x, images/photo.medium@2x.jpg 2x">
    <source media="(min-width:640px)" srcset="images/photo.large.jpg 1x, images/photo.large@2x.jpg 2x">
    <source media="(min-width:1280px)" srcset="images/photo.xlarge.jpg 1x, images/photo.xlarge@2x.jpg 2x">
    <img src="images/photo.jpg" alt="Alt tag describing the image represented">
</picture>
</noscript-->
</body>
</html>
```

## srcset


For srcset we could do

```html
<!DOCTYPE HTML>
<html>
<head>
<link href='css/style.css' rel='stylesheet' type='text/css'>
<script src=js/R.js></script>
</head>
<body>

<script>Respondu('srcset');</script>
<noscript>

<img src="images/photo.jpg" srcset="images/photo.small.jpg 320w, images/photo.small@2x.jpg 320w 2x, images/photo.medium.jpg 640w, images/photo.medium@2x.jpg 640w 2x, images/photo.large.jpg 1280w, images/photo.large@2x.jpg 1280w 2x, images/photo.xlarge.jpg 20000w, images/photo.xlarge@2x.jpg 20000w x2">

</noscript-->

</body>
</html>
```

Creating an Implementation
===
We create an implementation by adding it to the Respondu prototype, 
the format for creating an implementation is:

```javascript
  Respondu.plugin('MyNewImplementation', function (doc, done) {
    // all your code here
    done();
  });

```

The `doc` parameter is a DOM object (but not the actual DOM)
The `done` paremeter is called as a function when processing is complete 
(using the `done` callback function allows for any async stuff)

We could then use it with
```html
<script>Respondu('MyNewImplementation');</script>
```


Here's how we could implement picture (already included):

```javascript
Respondu.plugin('picture', function (doc, done) {
  if ('srcset' in document.createElement('picture')) { //if picture is implemented then just pass through
    if (done) done();
    return; 
  }

  var pictures = (doc.getElementsByTagName('picture')), pic, attrs, sources, src, i, c,
    media, sourceImg, img, sW = window.screen.width,  pixelRatio, 
    pr = window.devicePixelRatio || 1;//set devices pixel ratio;
        
  for(i = 0; i < pictures.length; i++) {
    pic = pictures[i];

    attrs = pic.attributes;
    sources = pic.getElementsByTagName('source');
    
    sourceCandidates = [];
    
    for(c = 0; c < sources.length; c++) {
      srcel = sources[c];
      media = srcel.getAttribute('media'); 
      //!media means no media attribute, so will be used if no other source elements qualify                        
      if (!media || matchMedia(media).matches) { sourceCandidates.push(srcel); }                                                                                          
    }
    
    var x = sourceCandidates.length, closest = 0;
    
    if (x > 1) {
      while(x--) {
        media = sourceCandidates[x].getAttribute('media');
        if (!media && sourceCandidates.length > 1) { 
          delete sourceCandidates[x];
          break;
        }
        
        media = media.match(/\((min|max)-width:([0-9]+)(px|em)\)/);
        
        
        if (Math.abs(media[2] - sW) <= Math.abs(closest - sW)) {
          closest = media[2];
          sourceImg = sourceCandidates[x];
        }
      
      }
    } else {
      sourceImg = sourceCandidates[0];
    }
   
    var srcset, srcsetCounter, srcsetToken, imageSrc;
    if (sourceImg) {
      srcset = sourceImg.getAttribute('srcset').split(',');
      
      srcsetCounter = srcset.length;
      
      while (srcsetCounter--) {
        srcsetToken = srcset[srcsetCounter].replace(/^\s\s*/, '').replace(/\s\s*$/, '').split(' ');
        
        if (srcsetToken[1] === pr + 'x') {
          imageSrc = srcsetToken[0];
        }
        
        if (!srcsetToken[1]) {
          //no density supplied, assume default
          imageSrc = srcsetToken[0];            
        }
      
      
      }
    
    
      img = doc.createElement('img'); //create a new image element on the ghost DOM

      img.setAttribute('src', imageSrc);

              
      for(c = 0; c < attrs.length; c++) {
       img.setAttribute(attrs[c].nodeName, attrs[c].nodeValue);        
      }
      
     
      pic.parentNode.replaceChild(img, pic); //replace picture element with created img element
    }
  }
  


  done(); //finished.
});    

```



How It Works
===
Wrapping content in `<noscript>` tags stops it from being added to the DOM, whilst also providing complete content to non-js clients (such as
search engine bots, screen readers, text browsers). 
On some browsers its possible to extract and process the content of the `<noscript>` tags using normal methods (e.g. getElementById etc.) 
Other browsers (IE, Safari) however, actually remove the content of the noscript tags as soon as the Javascript engine initializes. 
So Respondu uses a hack to to ensure the content can be extracted from all browsers.

We do this by dynamically wrapping the `<noscript>` tags in another context - there are several ways: comments, textareas, script tags, style tags...

After experimentation and thought, Respondu's chosen way is to wrap the `<noscript>` tags with `<style>` tags, this seems to be the least invasive.

So once the script on the page has executed we end up with `<style type="text/responsive"><noscript>#content#</noscript-->`, this prevents the content in the
noscript tags from being removed, and allows us to extract the contents from the noscript tags. 

As a result, any inline styles in the body (..which are really unneccessary and sub-optimal) should be included with `<css>` tags instead of `<style>`
tags, e.g.

```
<script>Respondu();</script>
<noscript>
content etc.
<css>
  #silly {color:blue}
</css>
</noscript-->
```

Respondu will parse the css tags, and convert them to style tags. 
It's really just best to avoid inline styles if you can.

Once the noscript content has been extracted, Respondu loads it into a "ghost DOM". (see [createHTMLDocument](https://developer.mozilla.org/en/DOM/DOMImplementation.createHTMLDocument))
The ghost DOM doesn't load any src's. We can manipulate this ghost DOM as the `doc` parameter when creating implementations (see [Creating an Implementation](#creating-an-implementation))

Once all changes have been made to our ghost document (e.g. when we've replaced img src's according to screen width), we load it into the real document

Body Scripts
===
If we want to have scripts execute once the DOM has loaded, the best place for them (if possible) is usually just before the closing `</body>` tag.
If you're using Respondu, you want them to be just before the closing `</noscript-->` tags, Respondu will then ensure they are loaded and executed
after all the content has loaded. 

```
<body>
<script>Respondu();</script>
<noscript>
content etc.

<script src=myScriptWhichWillManipulateTheDocument.js></script>
</noscript-->
</body>
```

doclate
===
If you're using jQuery, and absolutely need to include scripts in the head but you're using `$(document).ready`
to defer execution until the DOM has loaded then Respondu can accomodate you. 

Just include doclate.js after jQuery, but before R.js

```
<script src=//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js></script>
<script src='js/doclate.js'></script>
<script src='js/R.js'></script>
```

In production you'll probably want to merge (and minify) doclate.js and R.js to reduce the amount of
HTTP connections on page load.

Any calls to any variations of jQuery's DOM ready (`$(document).ready(fn)`, `$(document).bind('ready', fn)`  or simply `$(fn)`)
will be buffered by doclate and then executed (in order) by R.js after all the responsive processing has completed.

Whilst this makes things easier, it's not as efficient as simply including your scripts at the bottom of the body.


Browsers Confirmed as Working (tentative, re-testing required)
===

* Chrome
* IE 7
* IE 8
* IE 9
* Firefox
* iOS Safari
* Safari (win)
* Opera

Todo
===

* explain the callback functionality


Contributing
===
I warmly welcome all contributions, you can help by

* testing
* pull requests
* issues
* suggesting a name

/*! respondu - v0.0.52012-10-04 | David Mark Clements | BSD License */

/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/* With extra support for ie < 9, see https://github.com/benschwarz/matchMedia.js/tree/IE7-8 */
window.matchMedia = window.matchMedia || (function(doc, undefined){

  var docElem  = doc.documentElement,
      refNode  = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement('body'),
      div      = doc.createElement('div');

  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);

  var mqRun = function ( mq ) {
    div.innerHTML = '&shy;<style media="' + mq + '"> #mq-test-1 { width: 42px; }</style>';
    docElem.insertBefore( fakeBody, refNode );
    bool = div.offsetWidth === 42;
    docElem.removeChild( fakeBody );
    
    return { matches: bool, media: mq };
  },
  
  getEmValue = function () {
    var ret,
        body = docElem.body,
        fakeUsed = false;

    div.style.cssText = "position:absolute;font-size:1em;width:1em";

    if( !body ) {
      body = fakeUsed = doc.createElement( "body" );
      body.style.background = "none";
    }

    body.appendChild( div );

    docElem.insertBefore( body, docElem.firstChild );

    if( fakeUsed ) {
      docElem.removeChild( body );
    } else {
      body.removeChild( div );
    }
    
    //also update eminpx before returning
    ret = eminpx = parseFloat( div.offsetWidth );

    return ret;
  },
  
  //cached container for 1em value, populated the first time it's needed 
  eminpx,
  
  // verify that we have support for a simple media query
  mqSupport = mqRun( '(min-width: 0px)' ).matches;

  return function ( mq ) {
    if( mqSupport ) {
      return mqRun( mq );
    } else {
      var min = mq.match( /\(min\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/ ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ),
          max = mq.match( /\(max\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/ ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ),
          minnull = min === null,
          maxnull = max === null,
          currWidth = doc.body.offsetWidth,
          em = 'em';
      
      if( !!min ) { min = parseFloat( min ) * ( min.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 ); }
      if( !!max ) { max = parseFloat( max ) * ( max.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 ); }
      
      bool = ( !minnull || !maxnull ) && ( minnull || currWidth >= min ) && ( maxnull || currWidth <= max );

      return { matches: bool, media: mq };
    }
  };

}( document ));

;(function (_w) {

  function iedoc() {
    var root, iedom = new ActiveXObject("htmlfile");
    iedom.appendChild(iedom.createElement('html'));
    root = iedom.getElementsByTagName('html')[0];
    root.appendChild(iedom.createElement('head'));
    root.appendChild(iedom.createElement('body'));
    iedom.open(); //doesn't seem to work without this. hackarrific
    iedom.close();
    return iedom;
  }
  var DOMReady;  
  function i(){if(d){return}d=true;if(document.addEventListener&&!c.opera){document.addEventListener("DOMContentLoaded",g,false)}if(c.msie&&_w==top)(function(){if(e)return;try{document.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}g()})();if(c.opera){document.addEventListener("DOMContentLoaded",function(){if(e)return;for(var a=0;a<document.styleSheets.length;a++)if(document.styleSheets[a].disabled){setTimeout(arguments.callee,0);return}g()},false)}if(c.safari){var a;(function(){if(e)return;if(document.readyState!="loaded"&&document.readyState!="complete"){setTimeout(arguments.callee,0);return}if(a===undefined){var b=document.getElementsByTagName("link");for(var c=0;c<b.length;c++){if(b[c].getAttribute("rel")=="stylesheet"){a++}}var d=document.getElementsByTagName("style");a+=d.length}if(document.styleSheets.length!=a){setTimeout(arguments.callee,0);return}g()})()}h(g)}function h(a){var b=_w.onload;if(typeof _w.onload!="function"){_w.onload=a}else{_w.onload=function(){if(b){b()}a()}}}function g(){if(!e){e=true;if(f){for(var a=0;a<f.length;a++){f[a].call(_w,[])}f=[]}}}var a={};var b=navigator.userAgent.toLowerCase();var c={version:(b.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(b),opera:/opera/.test(b),msie:/msie/.test(b)&&!/opera/.test(b),mozilla:/mozilla/.test(b)&&!/(compatible|webkit)/.test(b)};var d=false;var e=false;var f=[];DOMReady=function(a,b){i();if(e){a.call(_w,[])}else{f.push(function(){return a.call(_w,[])})}};i()  
  if(!Array.prototype.reduce){Array.prototype.reduce = function(b){if(this===null||this===undefined)throw new TypeError("Object is null or undefined");var c=0,d=this.length>>0,e;if(typeof b!=="function")throw new TypeError("First argument is not callable");if(arguments.length<2){if(d===0)throw new TypeError("Array length is 0 and no second argument");e=this[0];c=1}else e=arguments[1];while(c<d){if(c in this)e=b.call(undefined,e,this[c],c,this);++c}return e}}
  if(!String.prototype.trim) {String.prototype.trim = function () {return this.replace(/^\s+|\s+$/g,'');};}
  

  var doc = document.implementation.createHTMLDocument ? document.implementation.createHTMLDocument('') : iedoc(),
   _d = _w.document, mapTag;
   


  _w.Respondu = function (implementation, opts, cb) {
    if (!(this instanceof _w.Respondu)) {return new _w.Respondu(implementation, opts, cb);}    
    var self = this, 
    defaults = {
    escaper: "<!--", //specify alternative escape code
    hires: true,
    hiresSuffix: '@2x',
    className: 'responsive',
    typical: 'small',
    breakpoints: { //
        small: 320,
        medium: 640, 
        large: 1280, //configurable properties, will be reflected in requested image e.g. name.medium.png       
        xlarge: Infinity //largest size set to infinity 
      }
    }, context = _d.getElementsByTagName("*");
    

    
    this.context = context[context.length - 1];
    

    if (typeof implementation !== 'string') { opts = implementation; implementation = null; }

    if (typeof opts === 'function') { cb = opts; opts = null; }
    
    this.cb = cb;
    opts = opts || defaults;
    
    opts.breakpoints.typical = opts.breakpoints[opts.typical];
    delete opts.breakpoints[opts.typical];
    
    this.opts = opts;
    this.opts.breakpoints = opts.breakpoints || defaults.breakpoints;
 
      
    //opts.escaper = opts.escaper || "<style id=respondu type=responsive/html>";
    mapTag = 'css';
	
      


    
    DOMReady(function() {
      var _b = _d.getElementsByTagName('body')[0], toProcess;
      function extract(_h) { 
        var x; 
        x = _h
           .replace(/<\/?noscript(.+)?>?/g, '') //remove the noscript tags
           .replace(/(<picture(.+)?>)/g,'$1<video>') //iOS Safari at least strips source tags unless they're wrapped in video tags
       
        if (Respondu.ltIE9) {       
          x = x.replace(/<picture/g, '<div data-element="picture"').replace(/<source/g,'<p data-element="source"');
        }

        
        if (document.documentMode && document.documentMode < 9) x = x.replace(/<picture/g, '<div data-element="picture"').replace(/<source/g,'<p data-element="source"'); 
        
        doc.body.innerHTML = x;
        
        //console.log(x, doc.body.innerHTML);
      }
      
      toProcess = self.context.nextSibling;
      while (toProcess.nodeType !== 8) {toProcess = toProcess.nextSibling;}
     
    
      extract(toProcess.nodeValue);
      
    
      function selectImp() {
        if (implementation) {
          if (!self.plugins[implementation]) { 
            console.error('Respondu: ' + implementation + ' implementation not found'); 
            self.implement(doc, true);
            return;  
          }

          self.plugins[implementation](doc, function (breakpoints) {
            self.opts.breakpoints = breakpoints || self.opts.breakpoints;
            self.implement(doc, !!breakpoints);
          }, utils);
          return;
        } 
        self.implement(doc, true);
      }

      selectImp();
        
    });



    document.write(opts.escaper);
    

    
  }
  
   var utils = Respondu.prototype.utils = {
      each: each,    
      next: next
    };

  
    
    function each(collection, cb, done) {
        var el, i;
        for(i = 0; i < collection.length; i++) {
          el = collection[i];
          cb(el);
        }
        if (done) done();
      }

    function next(collection, cb) {
        if (!collection) return;
        function proceed() {
          cb(collection.shift(), function () {
            next(collection, cb);
          });
        }
        if (!(collection instanceof Array)) {      
          var a = [];
          try { collection = a.slice.call(collection); proceed();} 
          catch (e) { //for ie6/7/8 + Blackberry browser
            each(collection, function (item) {a.push(item)}, function () { collection = a; proceed(); });  
          }
          return;
        }
        proceed();
    }
    
    
    
      
     
     Respondu.prototype.plugins = {};
     
     Respondu.plugin = function (imp, fn) {
       Respondu.prototype.plugins[imp] = fn;
     }

     Respondu.module = function (mod, fn) {
       Respondu.prototype[mod] = fn;
     }     
     
     Respondu.prototype.implement = function (doc, res) {      
        var cb = this.cb, opts = this.opts,
          _b = _d.getElementsByTagName('body')[0]
        function respond(scrWth) {
          var size = '', key, i;
          if (scrWth <= opts.breakpoints.typical) return doc;
          delete opts.breakpoints.typical;
          for (key in opts.breakpoints) {
            if (opts.breakpoints.hasOwnProperty(key)) {            
              if (scrWth <= opts.breakpoints[key]) {
                size = key + '.';           
                break;
              }
            }
          }
          
          each(doc.images, function (im) {
            if (opts.className && (!im.className || !im.className.match(opts.className))) return;
            im.setAttribute('src', im.getAttribute('src').replace(/(.+)\.(.+)$/, '$1.' + size + '$2'));
          });
          
          return doc;
        }
        
        if (cb) { 
          cb(res ? respond(_w.screen.width) : doc, function () {   this.context.outerHTML = doc.body.innerHTML; });
        } else {
        
          this.context.outerHTML = res ? respond(_w.screen.width).body.innerHTML : doc.body.innerHTML;

        }
     
   
     }    
  
}(window));






Respondu.plugin('picture', function (doc, done) {
  if ('srcset' in document.createElement('picture')) { //if picture is implemented then just pass through
	  if (done) done();
    return; 
  }  
  
  var pictures = doc.getElementsByTagName('picture'), pic, attrs, sources, src, i, c,
    media, sourceImg, img, sW = window.screen.width,  pixelRatio, 
    pr = window.devicePixelRatio || 1;//set devices pixel ratio;
    

  
  if (!pictures.length) {
    pictures = doc.getElementsByTagName('div');
    c = pictures.length;
    while (c--) {
      if (pictures[c].attributes['data-element'].nodeValue !== 'picture') delete pictures[c];
    }
  }
      
  for(i = 0; i < pictures.length; i++) {
    pic = pictures[i];
    attrs = pic.attributes;
    sources = pic.getElementsByTagName('source');
    
    if (!sources.length) {
      sources = doc.getElementsByTagName('p');
      c = sources.length;
      while (c--) {
        if (sources[c].attributes['data-element'].nodeValue !== 'source') delete sources[c];
      }
    }
    
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






Respondu.plugin('srcset', function (doc, done, utils) {
  if ('srcset' in document.createElement('img')) { //if srcset is implemented then just pass through
    if (done) done();
    return; 
  }
  
  var viewport = {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight, ratio: window.devicePixelRatio || 1};
  var each = utils.each, dims = ['w','h','x'], potentials = [], chosen;
  

  
  function getToken(dimen /* h, w, x */, toks) { 
    var reg = (dimen !== 'x') ? '[0-9]+' + dimen : '[1-9]+(\.[1-9]+)?' + dimen, 
      defval = (dimen !== 'x') ? 0 : 1,
      token = toks.match(new RegExp(reg));
    return +(token ? token[0].replace(dimen, '') : '') || defval; //+ to numericalize
  }
  
  function getCans(srcset) {
    var urlreg = /(\S+)/, candidates = [];

    (function gC() {
      var url = srcset.match(urlreg)[0], toks, com, tokens = {}
      srcset = srcset.replace(urlreg, '');

      com = srcset.indexOf(',');
      
      if (com > -1) {          
        toks = srcset.substr(0, com).trim();
        srcset = srcset.substr(com + 1, srcset.length - 1).trim();          
      } else {            
        toks = srcset.substr(0, srcset.length).trim();
        srcset = '';          
      }
      
      each(dims, function (dim) {
       tokens[dim] = toks && getToken(dim, toks)
      });

      
      if ((tokens.w && tokens.w <= viewport.width || tokens.h && tokens.h <= viewport.height) && tokens.x === viewport.ratio) {
        tokens.url = url;
        candidates.push(tokens);
      }

      if (srcset) gC();
    }([]));
    
      return candidates;
              
  }
  
  each(doc.images, function (im) {       
    var srcset = im.getAttribute('srcset'), candidates = srcset && getCans(srcset);     
      if (!candidates || !candidates.length) return;

      chosen = candidates.reduce(function (p, c) {
        // if width is available on previous and current, return object with largest width
        // if not, then is height available on both, if so return one with largest height
        // if not return the one that has a width (if any) or else the one that has a height (if any)
        // or else return the current
        return (p.w && c.w) ? (p.w > c.w ? p : c) : ((p.h && c.h) ? (p.h > c.h ? p : c) : (c.w ? c : (p.w ? p : (c.h ? c : (p.h ? p : c)))));
      });
                         
      im.src = chosen.url;
    
  
  });
  
  done();

});

Respondu.ltIE9 = /*@cc_on  @if (@_jscript_version < 9) ! @end @*/false;

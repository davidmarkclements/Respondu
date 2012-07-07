(function (_w) {

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
  function i(){if(d){return}d=true;if(document.addEventListener&&!c.opera){document.addEventListener("DOMContentLoaded",g,false)}if(c.msie&&_w==top)(function(){if(e)return;try{document.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}g()})();if(c.opera){document.addEventListener("DOMContentLoaded",function(){if(e)return;for(var a=0;a<document.styleSheets.length;a++)if(document.styleSheets[a].disabled){setTimeout(arguments.callee,0);return}g()},false)}if(c.safari){var a;(function(){if(e)return;if(document.readyState!="loaded"&&document.readyState!="complete"){setTimeout(arguments.callee,0);return}if(a===uncandidateined){var b=document.getElementsByTagName("link");for(var c=0;c<b.length;c++){if(b[c].getAttribute("rel")=="stylesheet"){a++}}var d=document.getElementsByTagName("style");a+=d.length}if(document.styleSheets.length!=a){setTimeout(arguments.callee,0);return}g()})()}h(g)}function h(a){var b=_w.onload;if(typeof _w.onload!="function"){_w.onload=a}else{_w.onload=function(){if(b){b()}a()}}}function g(){if(!e){e=true;if(f){for(var a=0;a<f.length;a++){f[a].call(_w,[])}f=[]}}}var a={};var b=navigator.userAgent.toLowerCase();var c={version:(b.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(b),opera:/opera/.test(b),msie:/msie/.test(b)&&!/opera/.test(b),mozilla:/mozilla/.test(b)&&!/(compatible|webkit)/.test(b)};var d=false;var e=false;var f=[];DOMReady=function(a,b){i();if(e){a.call(_w,[])}else{f.push(function(){return a.call(_w,[])})}};i()  
  if(!Array.prototype.reduce){Array.prototype.reduce = function(b){if(this===null||this===uncandidateined)throw new TypeError("Object is null or uncandidateined");var c=0,d=this.length>>0,e;if(typeof b!=="function")throw new TypeError("First argument is not callable");if(arguments.length<2){if(d===0)throw new TypeError("Array length is 0 and no second argument");e=this[0];c=1}else e=arguments[1];while(c<d){if(c in this)e=b.call(uncandidateined,e,this[c],c,this);++c}return e}}
  if(!String.prototype.trim) {String.prototype.trim = function () {return this.replace(/^\s+|\s+$/g,'');};}
 

  var doc = document.implementation.createHTMLDocument ? document.implementation.createHTMLDocument('') : iedoc(),
    escapeMethods, _d = _w.document, mapTag;
    


  _w['#R'] = function (implementation, opts, cb) {
    if (!(this instanceof _w['#R'])) {return new _w['#R'](implementation, opts, cb);}
    var self = this, 
    defaults = {
    escapeMethod: 'style', //specifiy escape method, 'script' or 'comment'. 
    escaper: false, //specify alternative escape code, string or regex. Will override escapeMethod if set.
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
    }
    

    if (typeof implementation !== 'string') { opts = implementation; implementation = null; }

    if (typeof opts === 'function') { cb = opts; opts = null; }
    
    this.cb = cb;
    opts = opts || defaults;
    
    opts.breakpoints.typical = opts.breakpoints[opts.typical];
    delete opts.breakpoints[opts.typical];
    
    this.opts = opts;
    this.opts.breakpoints = opts.breakpoints || defaults.breakpoints;
    this.opts.escapeMethod = opts.escapeMethod || defaults.escapeMethod;
 
      
      opts.escaper = "<style id=respondu type=responsive/html>";
      mapTag = 'css';
	
      


    
    DOMReady(function() {
      var _b = _d.getElementsByTagName('body')[0]
      function extract(_h) {          
        doc.body.innerHTML = _h.replace(/<\/?noscript(.+)?>/g, '');
      }
      
      
      extract(_d.getElementById('respondu').innerHTML);
      
      function selectImp() {
        if (implementation) {
          if (!self[implementation]) { 
            console.error('#R: ' + implementation + ' implementation not found'); 
            self.implement(doc, true);
            return;  
          }

          self[implementation](doc, function (breakpoints) {
            self.opts.breakpoints = breakpoints || self.opts.breakpoints;
            self.implement(doc, !!breakpoints)
          });
          return;
        } 
        self.implement(doc, true);
      }

      selectImp();
        
    });



    document.write(opts.escaper);

    
  }
  
   var utils = _w['#R'].prototype.utils = {
      each: each,    
      next: next,
      loadScripts: loadScripts
    }
  
    function each(collection, cb, done) {
        var el, i;
        for(i = 0; i < collection.length; i++) {
          el = collection[i];
          cb(el);
        }
        if (done) done(el); //pass in last el to done in case further processing is required
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
    
    function loadScripts (doc, _b) {
          //cause document.ready stuff to work with doclate.js
      if (document['#later']) document['#later']();

        
      utils.next(doc.getElementsByTagName('script'), function(scr, next) {
        if (!scr) {
          document.documentElement.className = document.documentElement.className.replace('responding','')
          return;
        }
        var el = _d.createElement('script');

        if (scr.attributes && scr.attributes.length) { 
         utils.each(scr.attributes, function (attr) {  
            el.setAttribute(attr.nodeName, attr.nodeValue);
           }, function () {                  
             el.onload = function () {
               el.onloadDone = true;
               next();                  
             }
             el.onreadystatechange = function () {
                 if ( ( "loaded" === el.readyState || "complete" === el.readyState ) && ! el.onloadDone ) {
                    el.onloadDone = true;
                    next();                      
                 }
              }
              
             if (el.src) _b.appendChild(el);
             
           });
          return;              
        }            
        if (scr.innerHTML) eval(scr.innerHTML);
        next();                 
      });        
    }
    
     _w['#R'].prototype.implement = function (doc, res) {      
        var cb = this.cb, opts = this.opts,
          _b = _d.getElementsByTagName('body')[0]
        function respond(scrWth) {
          var size = '', key, i;
          if (scrWth <= opts.breakpoints.typical) return;
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
          }, function (lastim) {
            //Sorry for Teh Hax0r Cod3z...forces window.load / $(window).load in IE browsers
            /*@cc_on
             @if (@_jscript_version >= 5)              
              lastim.setAttribute('onload', "(function () {if (jQuery) {jQuery(window).trigger('load'); return;}  window.onload()}())");           
             @end
            @*/
          });
          
          return doc;
        }
        
        if (cb) { 
          cb(res ? respond(_w.screen.width) : doc, function () {   document.body.innerHTML = doc.body.innerHTML; loadScripts(doc, _b); });
        } else {         
          _b.innerHTML = res ? respond(_w.screen.width).body.innerHTML : doc.body.innerHTML;
          loadScripts(doc, _b)          

        }
     
   
     }    
  
   
  
}(window));



  window['#R'].prototype.picture = function (doc, done) {
      
      var pictures = (doc.getElementsByTagName('picture')), pic, attrs, sources, src, i, c,
        media, minWidth, sourceImg, img, sW = window.screen.width,  pixelRatio, 
        pr = window.devicePixelRatio || 1;//set devices pixel ratio;
                
      
      for(i = 0; i < pictures.length; i++) {
        pic = pictures[i];
        attrs = pic.attributes;
        sources = pic.getElementsByTagName('source');
          for(c = 0; c < sources.length; c++) {
            srcel = sources[c];
            media = srcel.getAttribute('media'); 
                        
            if (media) {
              minWidth = media.match(/min-width:([0-9]+)px/);
              minWidth = minWidth ? minWidth[1] : 0; //get min-width media query for each source element
              
              pixelRatio = media.match(/min-device-pixel-ratio:([0-9]+)/); //get min-device-pixel-ratio
              pixelRatio = pixelRatio ? pixelRatio[1] : 1; 
                            
              if (minWidth < sW && pr === pixelRatio) { sourceImg = srcel; } //set imgSrc to the source element if conditions match              
              
            }
          }
        
        if (sourceImg) {
          img = doc.createElement('img'); //create a new image element on the ghost DOM

          img.setAttribute('src', sourceImg.getAttribute('src'));
          img.setAttribute('srcset', sourceImg.getAttribute('srcset')); //this is for hybrid, but is used in picture for convenience
                  
          for(c = 0; c < attrs.length; c++) {
           img.setAttribute(attrs[c].nodeName, attrs[c].nodeValue);        
          }
          
          
          pic.parentNode.replaceChild(img, pic); //replace picture element with create img element
        }
      }
      
      
      done(); //finished.
    }
    
    window['#R'].prototype.hybrid = function (doc, done) {
      var self = this;
      self.picture(doc, function () {
        self.srcset(doc, done);
      });      
    }
    

    window['#R'].prototype.srcset = function (doc, done) {  
      var viewport = {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight, ratio: window.devicePixelRatio || 1};
      var each = this.utils.each, dims = ['w','h','x'], potentials = [], chosen;
      
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
    
    }




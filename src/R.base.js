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
  
    alert(Respondu.ltIE9);
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






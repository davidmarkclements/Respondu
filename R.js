(function (_d, _w) {
var doc = document.implementation ? document.implementation.createHTMLDocument('R') : new ActiveXObject("htmlfile"),
  escapeMethods;
  
  _w['#R'] = function (opts, cb) {
    var defaults = {
    escapeMethod: 'script', //specifiy escape method, 'script' or 'comment'. 
    class: false, //string for single class or array of classes (TODO -> OR object containing breakpoints)
    escaper: false, //specify alternative escape code, string or regex. Will override escapeMethod if set.
    breakpoints: { //
        typical: 500,
        medium : 1000, //configurable properties, will be reflected in requested image e.g. name.medium.png
        large : Infinity //largest size set to infinity
      }
    }
    if (typeof opts === 'function') { cb = opts; opts = null; }
    opts = opts || defaults;
    opts.breakpoints = opts.breakpoints || defaults.breakpoints;
    opts.escapeMethod = opts.escapeMethod || defaults.escapeMethod;
    
    if (!opts.escaper) {
      escapeMethods = {
        script: '<script type="responsive/html">', //endtag </noscript></script>
        comment: '<!--#R' //endtag </noscript-->  
      };
      
      opts.escaper = escapeMethods[opts.escapeMethod];
    }

    function i(){if(d){return}d=true;if(document.addEventListener&&!c.opera){document.addEventListener("DOMContentLoaded",g,false)}if(c.msie&&window==top)(function(){if(e)return;try{document.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}g()})();if(c.opera){document.addEventListener("DOMContentLoaded",function(){if(e)return;for(var a=0;a<document.styleSheets.length;a++)if(document.styleSheets[a].disabled){setTimeout(arguments.callee,0);return}g()},false)}if(c.safari){var a;(function(){if(e)return;if(document.readyState!="loaded"&&document.readyState!="complete"){setTimeout(arguments.callee,0);return}if(a===undefined){var b=document.getElementsByTagName("link");for(var c=0;c<b.length;c++){if(b[c].getAttribute("rel")=="stylesheet"){a++}}var d=document.getElementsByTagName("style");a+=d.length}if(document.styleSheets.length!=a){setTimeout(arguments.callee,0);return}g()})()}h(g)}function h(a){var b=window.onload;if(typeof window.onload!="function"){window.onload=a}else{window.onload=function(){if(b){b()}a()}}}function g(){if(!e){e=true;if(f){for(var a=0;a<f.length;a++){f[a].call(window,[])}f=[]}}}var a=window.DomReady={};var b=navigator.userAgent.toLowerCase();var c={version:(b.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(b),opera:/opera/.test(b),msie:/msie/.test(b)&&!/opera/.test(b),mozilla:/mozilla/.test(b)&&!/(compatible|webkit)/.test(b)};var d=false;var e=false;var f=[];a.ready=function(a,b){i();if(e){a.call(window,[])}else{f.push(function(){return a.call(window,[])})}};i()

    DomReady.ready(function() {
        
        var _b = _d.getElementsByTagName('body')[0];    
        
        function matchClass(el, cls) {
          if (!el.getAttribute('class')) return;                  

          var actions = {
            '[object Array]': function () {
              var i, hasClass;
              for(i = 0; i < cls.length; i++) {               
               if (el.getAttribute('class').match(cls[i])) hasClass = true;
              }
              return hasClass;               
            },
            '[object Object]': function () {
              //TODO: may need to restructure respond in order to provide different breakpoints
              // according to class
              return false;
            },
            '[object String]': function () {
              return el.getAttribute('class').match(cls);              
            }
          },
            clsType = Object.prototype.toString.call(cls)

          return actions[clsType] && actions[clsType]();
        } 

        function respond(scrWth) {
          var size = '', key, i;
          for (key in opts.breakpoints) {
            if (opts.breakpoints.hasOwnProperty(key)) {
              if (scrWth <= opts.breakpoints[key]) {
                size = (key == 'typical') ? '' : key;           
                break;
              }
            }
          }
          var im;
          for(i = 0; i < doc.images.length; i++) {
            im = doc.images[i];
            if (!opts.class || opts.class && matchClass(im, opts.class)) {
              im.setAttribute('src', im.getAttribute('src').replace(/(.+)\.(.+)$/, '$1.' + size + '.$2'))
            }
          }
          
          return doc;
        }
        
        function extract(_h) {
          doc.body.innerHTML = _h.replace(/<\/?noscript(.+)?>/g, '').replace(opts.escaper, '');
        }
        
        extract(_b.innerHTML.toString());     
        if (cb) { 
          cb(respond(_w.screen.width));
        } else {
          _b.innerHTML = respond(_w.screen.width).body.innerHTML;
        }
        
      

    });

    document.write(opts.escaper);

  }
  
}(document, this));

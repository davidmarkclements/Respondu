(function (_d, _w) {
  _w['#R'] = function (opts) {
  var defaults = {
  breakpoints: {
      typical: 500,
      medium : 1000, //configurable properties, will be reflected in requested image e.g. name.medium.png
      large : Infinity
    }
  }

  opts = opts || defaults;

  function rsp() {document.write('<!--#R');  }
  function i(){if(d){return}d=true;if(document.addEventListener&&!c.opera){document.addEventListener("DOMContentLoaded",g,false)}if(c.msie&&window==top)(function(){if(e)return;try{document.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}g()})();if(c.opera){document.addEventListener("DOMContentLoaded",function(){if(e)return;for(var a=0;a<document.styleSheets.length;a++)if(document.styleSheets[a].disabled){setTimeout(arguments.callee,0);return}g()},false)}if(c.safari){var a;(function(){if(e)return;if(document.readyState!="loaded"&&document.readyState!="complete"){setTimeout(arguments.callee,0);return}if(a===undefined){var b=document.getElementsByTagName("link");for(var c=0;c<b.length;c++){if(b[c].getAttribute("rel")=="stylesheet"){a++}}var d=document.getElementsByTagName("style");a+=d.length}if(document.styleSheets.length!=a){setTimeout(arguments.callee,0);return}g()})()}h(g)}function h(a){var b=window.onload;if(typeof window.onload!="function"){window.onload=a}else{window.onload=function(){if(b){b()}a()}}}function g(){if(!e){e=true;if(f){for(var a=0;a<f.length;a++){f[a].call(window,[])}f=[]}}}var a=window.DomReady={};var b=navigator.userAgent.toLowerCase();var c={version:(b.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(b),opera:/opera/.test(b),msie:/msie/.test(b)&&!/opera/.test(b),mozilla:/mozilla/.test(b)&&!/(compatible|webkit)/.test(b)};var d=false;var e=false;var f=[];a.ready=function(a,b){i();if(e){a.call(window,[])}else{f.push(function(){return a.call(window,[])})}};i()

  DomReady.ready(function() {

      var _b = _d.getElementsByTagName('body')[0];    
     

      function respond(scrWth, _h) {
        var size = '', key;
        for (key in opts.breakpoints) {
          if (opts.breakpoints.hasOwnProperty(key)) {
            if (scrWth <= opts.breakpoints[key]) {
              size = (key == 'typical') ? '' : key + '.';           
              break;
            }
          }
        }
        return _h.replace(/src=["']?(.+)\.(.+)#R/g, 'src="$1.' + size + '$2"');
      }
      
      function extract(_h) {
        return _h.replace(/<\/?noscript(.+)?>/g, '').replace(/<\!--#R/g, ''); 
      }
      
      var x = respond(_w.screen.width, _b.innerHTML.toString());
      _b.innerHTML = extract(x);
      


  });
  rsp();
  }
  
}(document, this));

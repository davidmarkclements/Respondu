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

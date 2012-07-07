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


    window['#R'].prototype.hybrid = function (doc, done) {
      var self = this;
      self.picture(doc, function () {
        self.srcset(doc, done);
      });      
    }


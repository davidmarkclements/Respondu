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

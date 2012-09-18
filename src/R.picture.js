 window['#R'].prototype.picture = function (doc, done) {
      
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
          //TODO: improve srcset parsing (more flexibility and checks)
          //TODO: cater to use cases with both EMS and PX's
          //TODO: test with max-width and max-width min-width combined 
          //TODO: what about mixed media queries? e.g. (min-width:200px) and (max-width:1000px)
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
    }

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






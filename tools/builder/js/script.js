// Converts image to canvas; returns new canvas element
function convertImageToCanvas(image) {
	var canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	canvas.getContext("2d").drawImage(image, 0, 0);

	return canvas;
}


// Converts canvas to an image
function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
}




var dd = document.getElementById('dragndrop'), code = document.getElementById('code');

function process(fname) {
  return escape(document.getElementById('path').value) + '/' + escape(fname);
}

dd.ondrop = function (e) { 
  var files = e.dataTransfer.files, r;
  
  code.innerHTML = 'function sixtyFour() {\n var img = [];\n';
  
  
  for (var i = 0, f; f = files[i]; i++) {
    if (!f.type.match('image.*')) continue;

    r = new FileReader();    
    r.onload = (function(file) { 
      return function (e) {
        code.innerHTML += "  img['" + process(file.name) +"'] = '" + e.target.result + "';\n";
        
        if (i === files.length) code.innerHTML += '}';
      }
    
    r.onprogress = function (e) {
      $('#progress').html(Math.round((e.loaded / e.total) * 100))
    
    }
    
    
        
    }(f));
    r.readAsDataURL(f);
  }
  



e.preventDefault();

}



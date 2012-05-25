(function (_w) {
  var queue = [], libCache;
  
// grabs options from a JSON string suffixed to the src like so
//<script src='js/docLater.js#{"lib":"DomReady","methods":"ready"}'></script>
//  var opts = JSON.parse([].pop.call(document.scripts).src.split('#')[1]) || {}; 
  var opts = {};
  
  var lib = opts.lib || 'jQuery', libAlias = opts.libAlias, 
    docReadyMethods = opts.methods || [], docReadyArgs = opts.args || [];
  
    if (lib === 'jQuery') {
      libAlias = libAlias || '$'; 
      docReadyMethods = docReadyMethods.length || ['ready', 'bind'];
      docReadyArgs = docReadyArgs.length || ['ready'];       
    }
    
    function each(collection, cb, done) {
        var el, i;
        for(i = 0; i < collection.length; i++) {
          el = collection[i];
          cb(el);
        }
        if (done) done();
      }    
    
  libCache = _w[lib];
  
  if (libCache) {

    _w[lib] = function (h, h2) { //h: handler, h2: handler in second position          
      if (typeof h === 'function') return queue.push(h); 
      if (h === document && docReadyMethods.length) {
        var meths = {};
        each(docReadyMethods, function (meth) {
          meths[meth] = _w[lib];
        }); 
      
        return meths;  
      }
      
      
      if (typeof h === 'string'  && docReadyArgs.length) {
        var isValidArg;
        each(docReadyArgs, function (arg) {
          if (h === arg) isValidArg = true;
        });
       if (isValidArg) return _w[lib](h2);
       
      }
      
      return libCache.apply(this, [].slice.call(arguments))
      
    }

    if (libAlias) _w[libAlias] = _w[lib];
  }
  
  document['#later'] = function () {
    each(queue, function (h) { h(); });
  }

}(window));

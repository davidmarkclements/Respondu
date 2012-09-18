module.exports = function(grunt) {

 grunt.initConfig({
  pkg: '<json:package.json>', 
  concat: {
    dist: {
      src: ['src/R.base.js', 'src/R.picture.js', 'src/R.srcset.js'],
      dest: 'R.js'
    }
  },
  min: {
    dist: {
      src: ['src/R.base.js', 'src/R.picture.js', 'src/R.srcset.js'],
      dest: 'R.min.js'
    },    
    example: {
        src: ['src/R.base.js', 'src/R.picture.js', 'src/R.srcset.js'],
        dest: 'examples/js/R.js'
      },
    picture: {
      src: ['src/R.base.js', 'src/R.picture.js'],
      dest: 'builds/R.picture.min.js'
    },
    srcset: {
      src: ['src/R.base.js', 'src/R.srcset.js'],
      dest: 'builds/R.srcset.min.js'
    }    
  },
  
  server: {
    port: 3000,
    base: 'examples'
  },
  
  watch: {
    files: ['src/R.base.js', 'src/R.picture.js', 'src/R.srcset.js'],
    tasks: 'concat min'
  }
  
  
});


grunt.registerTask('default', 'server concat min watch')


};

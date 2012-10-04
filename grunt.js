module.exports = function(grunt) {

 grunt.initConfig({
  pkg: '<json:package.json>', 
  meta: {
     banner: '/*! <%= pkg.name %> - v<%= pkg.version %>' +
      '<%= grunt.template.today("yyyy-mm-dd") %> | <%= pkg.author %> | <%= pkg.license %> License */'
  },  
  concat: {
    dist: {
      src: ['<banner>', 'lib/matchMedia-MQ.js', 'src/R.base.js', 'src/R.picture.js', 'src/R.srcset.js', 'lib/ltIE9Check.js'],
      dest: 'R.js'
    },
    example: {
        src: ['R.js'],
        dest: 'examples/js/R.js'
      },    
  },
  customMin: {
    dist: {
      src: ['<banner>', 'lib/matchMedia-MQ.js', 'src/R.base.js', 'src/R.picture.js', 'src/R.srcset.js'],
      dest: 'R.min.js'
    },        
    picture: {
      src: ['lib/matchMedia-MQ.js', 'src/R.base.js', 'src/R.picture.js'],
      dest: 'builds/R.picture.min.js'
    },
    srcset: {
      src: ['src/R.base.js', 'src/R.srcset.js'],
      dest: 'builds/R.srcset.min.js'
    },
    
    core: {
     src: ['src/R.base.js', 'src/R.srcset.js'],
     dest: 'builds/R.core.min.js'     
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

  grunt.registerMultiTask('customMin', 'Minify files with UglifyJS and @cc_on support', function() {
    var files = grunt.file.expandFiles(this.file.src);

    var banner = grunt.task.directive(files[0], function() { return null; });
    if (banner === null) {
      banner = '';
    } else {
      files.shift();
    }
    var max = grunt.helper('concat', files, {separator: this.data.separator});

    /*added custom bit right here, hacky hackeeey:*/
    var ltIE9Check = grunt.helper('concat', ['lib/ltIE9Check.js'], {separator: this.data.separator});


    var min = banner + grunt.helper('uglify', max, grunt.config('uglify')) + ltIE9Check;
    grunt.file.write(this.file.dest, min);


    if (this.errorCount) { return false; }

    grunt.log.writeln('File "' + this.file.dest + '" created.');
    // ...and report some size information.
    grunt.helper('min_max_info', min, max);
  });





grunt.registerTask('default', 'server concat customMin watch')


};

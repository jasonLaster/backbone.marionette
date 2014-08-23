var path = require('path');
var unwrap = require('unwrap');
var dox = require('dox');
var _ = require('underscore');
var yaml = require('js-yaml')

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      core_banner:
        '// MarionetteJS (Backbone.Marionette)\n' +
        '// ----------------------------------\n' +
        '// v<%= pkg.version %>\n' +
        '//\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' +
        '// Distributed under MIT license\n' +
        '//\n' +
        '// http://marionettejs.com\n' +
        '\n',
      banner:
        '<%= meta.core_banner %>\n' +
        '/*!\n' +
        ' * Includes BabySitter\n' +
        ' * https://github.com/marionettejs/backbone.babysitter/\n' +
        ' *\n' +
        ' * Includes Wreqr\n' +
        ' * https://github.com/marionettejs/backbone.wreqr/\n' +
        ' */\n\n\n'
    },
    assets: {
      babysitter:   'bower_components/backbone.babysitter/lib/backbone.babysitter.js',
      underscore:   'bower_components/underscore/underscore.js',
      backbone:     'bower_components/backbone/backbone.js',
      jquery:       'bower_components/jquery/dist/jquery.js',
      sinon:        'bower_components/sinonjs/sinon.js',
      wreqr:        'bower_components/backbone.wreqr/lib/backbone.wreqr.js'
    },

    clean: {
      lib: 'lib'
    },

    bower: {
      install: {
        options: {
          copy: false
        }
      }
    },

    preprocess: {
      core: {
        src: 'src/build/marionette.core.js',
        dest: 'tmp/marionette.core.js'
      },
      bundle: {
        src: 'src/build/marionette.bundled.js',
        dest: 'tmp/backbone.marionette.js'
      }
    },

    template: {
      options: {
        data: {
          version: '<%= pkg.version %>'
        }
      },
      core: {
        src: '<%= preprocess.core.dest %>',
        dest: '<%= preprocess.core.dest %>'
      },
      bundle: {
        src: '<%= preprocess.bundle.dest %>',
        dest: '<%= preprocess.bundle.dest %>'
      }
    },

    concat: {
      options: {
        banner: '<%= meta.core_banner %>'
      },
      core: {
        src: '<%= preprocess.core.dest %>',
        dest: 'lib/core/backbone.marionette.js'
      },
      bundle: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= preprocess.bundle.dest %>',
        dest: 'lib/backbone.marionette.js'
      }
    },

    uglify : {
      core: {
        src : '<%= concat.core.dest %>',
        dest : 'lib/core/backbone.marionette.min.js',
        options : {
          banner: '<%= meta.core_bundle %>',
          sourceMap : 'lib/core/backbone.marionette.map',
          sourceMappingURL : '<%= uglify.bundle.options.sourceMappingURL %>',
          sourceMapPrefix : 1
        }
      },

      bundle: {
        src : '<%= concat.bundle.dest %>',
        dest : 'lib/backbone.marionette.min.js',
        options : {
          banner: '<%= meta.banner %>',
          sourceMap : 'lib/backbone.marionette.map',
          sourceMappingURL : 'backbone.marionette.map',
          sourceMapPrefix : 2
        }
      }
    },

    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../../../test/tmp/'
      }
    },

    instrument: {
      files: 'tmp/backbone.marionette.js',
      options: {
        lazy: true,
        basePath: 'test'
      }
    },

    mochaTest: {
      tests: {
        options: {
          require: 'spec/javascripts/setup/node.js',
          reporter: grunt.option('mocha-reporter') || 'nyan',
          clearRequireCache: true,
          mocha: require('mocha')
        },
        src: [
          'spec/javascripts/setup/helpers.js',
          'spec/javascripts/*.spec.js'
        ]
      }
    },

    storeCoverage: {
      options: {
        dir: 'coverage'
      }
    },
    makeReport: {
      src: 'coverage/**/*.json',
      options: {
        type: 'lcov',
        dir: 'coverage',
        print: 'detail'
      }
    },

    coveralls: {
      options: {
        src: 'coverage/lcov.info',
        force: false
      },
      default: {
        src: 'coverage/lcov.info'
      }
    },

    plato: {
      marionette : {
        src : 'src/*.js',
        dest : 'reports',
        options : {
          jshint : grunt.file.readJSON('.jshintrc')
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },

      marionette: {
        src: [ 'src/*.js' ]
      },

      specs: {
        options: {
          jshintrc: 'spec/.jshintrc'
        },

        files: {
          src: ['spec/javascripts/**.js']
        }
      }
    },

    jsDocFiles: {
     docs: {
        options: {
        },
        files: [{
          expand: true,
          cwd: 'api',
          src: '*.jsdoc',
          dest: 'jsdoc',
          ext: '.json'
        }]
      }
    },

    watch: {
      marionette : {
        options: {
          spawn: false
        },
        files : ['src/**/*.js', 'spec/**/*.js'],
        tasks : ['test']
      }
    },

    connect: {
      server: {
        options: {
          port: 8888
        }
      }
    },

    lintspaces: {
      all: {
        src: [
          'src/*.js',
          'docs/*.md'
        ],
        options: {
          editorconfig: '.editorconfig'
        }
      }
    },

    unwrap: {
      babysitter: {
        src: './bower_components/backbone.babysitter/lib/backbone.babysitter.js',
        dest: './tmp/backbone.babysitter.bare.js'
      },
      wreqr: {
        src: './bower_components/backbone.wreqr/lib/backbone.wreqr.js',
        dest: './tmp/backbone.wreqr.bare.js'
      }
    }
  });

  grunt.registerMultiTask('unwrap', 'Unwrap UMD', function () {
    var done = this.async();
    var timesLeft = 0;

    this.files.forEach(function (file) {
      file.src.forEach(function (src) {
        timesLeft++;
        unwrap(path.resolve(__dirname, src), function (err, content) {
          if (err) return grunt.log.error(err);
          grunt.file.write(path.resolve(__dirname, file.dest), content);
          grunt.log.ok(file.dest + ' created.');
          timesLeft--;
          if (timesLeft <= 0) done();
        });
      });
    });
  });

  grunt.registerMultiTask('jsDocFiles', function() {
    this.files.forEach(function(f) {
      f.src.filter(function(filepath) {
        return grunt.file.exists(filepath) && !grunt.file.isDir(filepath);
      }).map(function(filepath) {

        // read yaml file
        var file = grunt.file.read(filepath);

        try {
          var json = yaml.safeLoad(file);
        } catch (err){ 
          grunt.fail.fatal(err.name + ":\n"+  err.reason + "\n\n" + err.mark);
        }

        // parse function values
        _.each(json.functions, function(value, name) {
          var result = {};

          // Function values have both a description and examples
          // If the function value is a string, only the description was added
          if (_.isObject(value)) {
            result = value;
          } else {
            result.examples = [];
            result.description = value;
          }

          // parse jsDoc comment
          var doc = dox.parseComment(result.description);

          var tags = doc.tags || [];
          doc.api = _.findWhere(tags, {type: 'api'});
          doc.params = _.where(tags, {type: 'param'});

          result.description = doc;
          json.functions[name] = result;
        });

        // write parsed api to file
        var prettyJSON = JSON.stringify(json, undefined, 2);
        grunt.file.write(f.dest, prettyJSON);
      });
    });
  });

  grunt.registerTask('verify-bower', function () {
    if (!grunt.file.isDir('./bower_components')) {
      grunt.fail.warn('Missing bower components. You should run `bower install` before.');
    }
  });

  var defaultTestsSrc = grunt.config('mochaTest.tests.src');
  var defaultJshintSrc = grunt.config('jshint.marionette.src');
  var defaultJshintSpecSrc = grunt.config('jshint.specs.files.src');
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('mochaTest.tests.src', defaultTestsSrc);
    grunt.config('jshint.marionette.src', defaultJshintSrc);
    grunt.config('jshint.specs.files.src', defaultJshintSpecSrc);
    if (filepath.match('spec/javascripts/') && !filepath.match('setup') && !filepath.match('fixtures')) {
      grunt.config('mochaTest.tests.src', ['spec/javascripts/setup/helpers.js', filepath]);
      grunt.config('jshint.specs.files.src', filepath);
      grunt.config('jshint.marionette.src', 'DO_NOT_RUN_ME');
    }
    if (filepath.match('src/')) {
      grunt.config('jshint.marionette.src', filepath);
      grunt.config('jshint.specs.files.src', 'DO_NOT_RUN_ME');
    }
  });

  grunt.registerTask('default', 'An alias task for running tests.', ['test']);

  grunt.registerTask('lint', 'Lints our sources', ['lintspaces', 'jshint']);

  grunt.registerTask('test', 'Run the unit tests.', ['verify-bower', 'lint', 'unwrap', 'preprocess:bundle', 'template:bundle', 'mochaTest']);

  grunt.registerTask('coverage', ['unwrap', 'preprocess:bundle', 'template:bundle', 'env:coverage', 'instrument', 'mochaTest', 'storeCoverage', 'makeReport', 'coveralls']);

  grunt.registerTask('dev', 'Auto-lints while writing code.', ['test', 'watch:marionette']);

  grunt.registerTask('api', 'Build jsdoc api files', ['jsDocFiles']);

  grunt.registerTask('build', 'Build all three versions of the library.', ['clean:lib', 'bower:install', 'lint', 'unwrap', 'preprocess', 'template', 'mochaTest', 'concat', 'uglify']);
};

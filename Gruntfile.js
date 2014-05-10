var path = require('path');
var unwrap = require('unwrap');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
  });

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
      jasmineSinon: 'bower_components/jasmine-sinon/lib/jasmine-sinon.js',
      wreqr:        'bower_components/backbone.wreqr/lib/backbone.wreqr.js',
    },

    clean: {
      lib: 'lib',
      tmp: 'tmp'
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

    jasmine : {
      options : {
        helpers : [
          '<%= assets.sinon %>',
          '<%= assets.jasmineSinon %>',
          'spec/javascripts/helpers/*.js'
        ],
        specs : [

        // 'spec/javascripts/application.appRegions.spec.js',
        // 'spec/javascripts/application.spec.js',

        // 'spec/javascripts/closingViews.spec.js',
        // 'spec/javascripts/collectionView.attachToDOM.spec.js',
        // 'spec/javascripts/collectionView.emptyView.spec.js',
        // 'spec/javascripts/collectionView.itemViewOptions.spec.js',
        // 'spec/javascripts/collectionView.reset.spec.js',
        // 'spec/javascripts/collectionView.spec.js',
        // 'spec/javascripts/compositeView-itemViewContainer.spec.js',
        // 'spec/javascripts/compositeView.onBeforeRender.spec.js',
        // 'spec/javascripts/compositeView.spec.js',
        // 'spec/javascripts/itemView.spec.js',  (proxied methods)
        // 'spec/javascripts/layout.dynamicRegions.spec.js',
        // 'spec/javascripts/layout.spec.js',                       // jquery
        // 'spec/javascripts/region.spec.js',
        // 'spec/javascripts/regionManager.spec.js', (probably the new exception)
        'spec/javascripts/appRouter.spec.js',
        'spec/javascripts/behaviors.spec.js',
        'spec/javascripts/bindEntityEvents.spec.js',
        'spec/javascripts/callbacks.spec.js',
        'spec/javascripts/commands.spec.js',
        'spec/javascripts/controller.spec.js',
        'spec/javascripts/getOption.spec.js',
        'spec/javascripts/mixinUnderscoreCollection.spec.js',
        'spec/javascripts/module.spec.js',
        'spec/javascripts/module.stop.spec.js',
        'spec/javascripts/normalizeMethods.spec.js',
        'spec/javascripts/onDomRefresh.spec.js',
        'spec/javascripts/precompiledTemplateRendering.spec.js',
        'spec/javascripts/renderer.spec.js',
        'spec/javascripts/requestResponse.spec.js',
        'spec/javascripts/templateCache.spec.js',
        'spec/javascripts/templateHelpers.spec.js',
        'spec/javascripts/triggerMethod.spec.js',
        'spec/javascripts/unbindEntityEvents.spec.js',
        'spec/javascripts/view.entityEvents.spec.js',
        'spec/javascripts/view.spec.js',
        'spec/javascripts/view.triggers.spec.js',
        'spec/javascripts/view.uiBindings.spec.js',
        'spec/javascripts/view.uiEventAndTriggers.spec.js',

        ],
        vendor : [
          '<%= assets.jquery %>',
          '<%= assets.underscore %>',
          '<%= assets.backbone %>',
          '<%= assets.babysitter %>',
          '<%= assets.wreqr %>',
        ],
        keepRunner: true
      },
      marionette : {
        src : [
          '<%= preprocess.bundle.dest %>',
          'spec/javascripts/support/marionette.support.js'
        ],
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

    watch: {
      marionette : {
        files : ['src/**/*.js', 'spec/**/*.js'],
        tasks : ['test']
      },
      server : {
        files : ['src/**/*.js', 'spec/**/*.js'],
        tasks : ['jasmine:marionette:build']
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

  grunt.registerTask('default', 'An alias task for running tests.', ['test']);

  grunt.registerTask('lint', 'Lints our sources', ['lintspaces', 'jshint']);

  grunt.registerTask('test', 'Run the unit tests.', ['unwrap', 'preprocess:bundle', 'template:bundle', 'jasmine:marionette']);

  grunt.registerTask('dev', 'Auto-lints while writing code.', ['test', 'watch:marionette']);

  grunt.registerTask('build', 'Build all three versions of the library.', ['clean:lib', 'bower:install', 'lint', 'unwrap', 'preprocess', 'template', 'jasmine:marionette', 'concat', 'uglify', 'clean:tmp']);
};

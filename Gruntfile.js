'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    meta: {
      banner: '/**\n' +
      ' * <%= pkg.description %>\n' +
      ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * @link <%= pkg.homepage %>\n' +
      ' * @author <%= pkg.authors.join(", ") %>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
      ' */\n'
    },
    bower: {
      install: {}
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>\n(function(angular, undefined) {\n\'use strict\';\n',
        footer: '})(angular);',
        process: function(src, filepath) {
          return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        }
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': 'src/rut.js'
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js'
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/*.js'],
      options: {
        curly: false,
        browser: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        expr: true,
        node: true,
        globals: {
          exports: true,
          angular: false,
          $: false
        }
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      build: {
        singleRun: true,
        autoWatch: false
      },
      dev: {
        autoWatch: true
      }
    },
    gitcommit: {
      bump: {
        options: {
          message: "<%= pkg.version %>",
          noStatus: true
        },
        files: {
          src: [
            'bower.json',
            'dist/**/*'
            ]
        }
      }
    },
    gittag: {
      bump: {
        options: {
          tag: "v<%= pkg.version %>",
          noStatus: true
        }
      }
    },
    gitpush: {
      bump: {
        options: {
          branch: 'master',
          tags: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-karma');

  // Default task
  grunt.registerTask('default', ['build']);

  // Build task
  grunt.registerTask('build', ['bower', 'karma:build', 'concat', 'uglify']);

  // Test task
  grunt.registerTask('test', ['karma:build']);

  // Release Task
  grunt.registerTask('release', ['bump', 'build']);

  // Publish Task
  grunt.registerTask('publish', ['gitcommit:bump', 'gittag:bump', 'gitpush:bump']);

  // Provides the "bump" task.
  grunt.registerTask('bump', 'Increment version number', function() {
    var versionType = grunt.option('type');
    function bumpVersion(version, versionType) {
      var type = {patch: 2, minor: 1, major: 0},
          parts = version.split('.'),
          idx = type[versionType || 'patch'];
      parts[idx] = parseInt(parts[idx], 10) + 1;
      while(++idx < parts.length) { parts[idx] = 0; }
      return parts.join('.');
    }

    var version = grunt.config.data.pkg.version;
    version = bumpVersion(version, versionType || 'patch');

    grunt.config.data.pkg.version = version;
    grunt.file.write('bower.json', JSON.stringify(grunt.config.data.pkg, null, '  '));

    grunt.log.ok('Version bumped to ' + version);
  });

};

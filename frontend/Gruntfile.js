module.exports = function(grunt) {

  // Load S3 plugin
  grunt.loadNpmTasks('grunt-aws');

  // Static Webserver
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Project configuration.
  grunt.initConfig({
    aws: grunt.file.readJSON('.S3-keys.json'),
    pkg: grunt.file.readJSON('package.json'),
    s3: {
      options: {
        accessKeyId: "<%= aws.accessKeyId %>",
        secretAccessKey: "<%= aws.secretAccessKey %>",
        bucket: "<%= aws.bucket %>",
        region: "<%= aws.region %>"
      },
      public: {
        cwd: "public",
        src: "**",
        dest: "public/"
      },
      pages: {
        cwd: "pages",
        src: "**",
        dest: "pages/"
      },
      specificFiles: {
        files: [{
          src: "./index.html",
          dest: "index.html"
        },{
          src: "./login.html",
          dest: "login.html"
        }]
      }
    },
    connect: {
      server: {
        options: {
          port: 8081,
          base: ".",
          keepalive: true
        }
      }
    },
    uglify: {
       dev: {
           files: {
               'public/js/script.min.js': [ 'src/api.js', 'src/script.js', 'src/controllers.js', 'src/services.js' ],
               'public/js/auth.min.js': [ 'src/api.js', 'src/auth.js' ]
           }
       }
    },
    cssmin: {
      dev: {
        files: {
          'public/css/index_style.min.css': [ 'src/css/index_style.css']
        }
      }
    }
  });

  // Default task(s).
  grunt.registerTask("default", ["cssmin", "uglify", "connect"]);

  grunt.registerTask("s", ["cssmin", "uglify", "s3"]);

};

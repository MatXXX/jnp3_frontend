module.exports = function(grunt) {

  // Load S3 plugin
  grunt.loadNpmTasks('grunt-aws');

  // Static Webserver
  grunt.loadNpmTasks('grunt-contrib-connect');

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
          port: 8000,
          base: "public",
          keepalive: true
        }
      }
    }
  });

  // Default task(s).
  grunt.registerTask("default", ["connect"]);

};

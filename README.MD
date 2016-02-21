# Part 1
> npm init
  > # leave all blank, press enter until the end of the prompt

> # create '/book_api/app.js' web server with the simplest structure possible, just to see how it works:

  <code>
    var express = require('express');

    var app = express();
    var port = process.env.PORT || 3000;


    app.get('/', function(req, res) {
      res.send("Hello world");
    });

    app.listen(port, function() {
      console.log("Express.js server running on port: " + port);
    });
  </code>

> # access 'localhost:3000' from a web browser to see it responding 'Hello world' for you!

______
# Part 2

# It would be very tedious for us to tear down and tear up node server from console for every change we make.
# So we are going to install Gulp to wrape those update functionalyties for us.
# (there is a nice Gulp course on pluralsight from 'John Papa' which I strongly recommend by the way)

# To do that, install it to your package.json by doing:
> cd /book_api && npm install gulp --save

# We are going to leave the responsability of running up the node server to Gulp by using its oun console.
# To have access to it, we need to install gulp to our environment(windows, ubuntu, mac..) using:
> npm install gulp -g

# Gulp is just a task runner, so we need a plugin to do that refresh thing for us:
> npm install gulp-nodemon --save

# Now to make Gulp work, we are going to create a file named 'gulpfile.js' on '/book_api/' directory:
> cd book_api && touch gulpfile.js

  <code>
    var gulp = require('gulp'),
      nodemon = require('gulp-nodemon');

    gulp.task('default', function() {
      var configuration = {
        script: 'app.js', // File name gulp is going to run with the command 'node <file_name>'
        ext: 'js', // File extensions that gulp is going to watch for changes and then automactilly restart our app to tear then up
        env: {
          PORT: 8000 // Remember the "process.env.PORT" on app.js? Gulp will set this for us.
        },
        ignore: ['./node_modules/**'] // Gulp is not going to restart the server when whatever changes happens to the 'node_modules' directory
      };

      nodemon(configuration)
        .on('restart', function() {
          // This is a log function which will be executed whenever a changes occur to our project
          console.log('> RESTARTING THE SERVER TO TEAR UP CHANGES');
        });
    });
  </code>

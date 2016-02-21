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

# Now to make Gulp work, we are going to create a file named 'gulpfile.js' on 'book_api/' directory:
> touch gulpfile.js

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


# Now that we have a automaticlly refresh task for us, start our server by running "gulp" on the "/book_api" directory:
  > gulp


# Go to your web browser and notice that going to 'localhost:3000' doesn't works anymore.
# Try going to 'localhost:8000' and here it is!

# Go to the app.js file and update the "Hello world" to whatever you want, save it and see that change refresh automatically by gulp.


_____
# Part 3

  # Now we are going to write some HTTP verbs and routes to get some data.
  # On 'app.js' file, lets add an router object which will handle our project routes:

    <code>
    // ...
    var app = express();
    var port = process.env.PORT || 3000;
    // code above this will not be changed ...

      // BEGIN: code to be added
      var bookRouter = express.Router();
      bookRouter.route('/books') // the route name is not case sensitive, if you put 'booKs' or 'Books' it will work either way by typing '/api/books'
        .get(function(req, res) {
          var responseJson = {
            hello: "This is my api :)"
          }

          res.json(responseJson);
        });

      app.use('/api', bookRouter);
      // END: code to be added

    // code below will not be changed ...
    // app.get('/', function(req, res) {
    //   res.send("Hello world");
    // });
    // ...

    </code>

    # Now, with your gulp server running(if you forgot how to do it, type "cd book_api/ && gulp" on the terminal),
    # go to your browser and submit 'localhost:8000/api/books' and see that it returns the json
    {
      hello: "this is my api :)"
    }



# Part 3.1
  # Lets get data from a real database using MongoDB
  # To connect to our DB and manage this data easily, we are going to use an ORM framework named 'mongoose'
  # Now go to your terminal on the directory '/book_api' and add 'mongoose' to your package.json by doing:
  > npm install mongoose --save


  # The first thing we have to do, is to connect with our MongoDB

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


  # The first thing we have to do, is to connect with our MongoDB and add a Model, which is going to be the json file
  # that mongoose will use to translate the book object for us from the database.
  # go to 'book_api/app.js' and do it:
  <code>
    var express = require('express'),
    mongoose = require('mongoose'); // IMPORTANT: dont forget to add mongoose lib


    var db = mongoose.connect("mongodb://localhost/bookAPI");
    var Book = require('./models/bookModel');

    // var app = express();
    // var port = process.env.PORT || 3000;
  </code>

  # Go inside 'book_api/' directory and then create a folder named "models" and a file named 'bookModel.js' inside it:
  > cd book_api #if you have not done that already before
  > mkdir models
  > touch models/bookModel.js


  # Go ahead and create the mongoose model 'Book':
  <code>
    var mongoose = require('mongoose'),
      Schema = mongoose.Schema;

    var bookModel = new Schema({
      title: {
        type: String
      },
      author: { type: String },
      genre: { type: String },
      read: { type: Boolean, default: false }
    });

    module.exports = mongoose.model('Book', bookModel);
  </code>

# Now go and use this model on the API call on 'app.js'
<code>
  var bookRouter = express.Router();
  bookRouter.route('/books')
    .get(function(req, res) {

      // BEGIN: code changes
      Book.find(function(err, books) {
        if(err) {
          res.status(500).send(err);
        } else {
          res.json(books);
        }
      });
      // END: code changes

    });
</code>

# And type on the browser: 'localhost:8000/api/books'
# it might return '[]' for you, which means that our database is empty.
# Dont worry, we will create an insert function soon.


______
# Part 3.2

  # Lets add some filter functionallity
  # If you go to your browser and type 'localhost:8000/api/books?genre=Drama', express will parse those parameters after 'books?' into the
  # request object so you can acess it by calling 'req.query'.
  # We can send those parameters by adding it before the callback function of Book model, like "Book.find(req.query, function() {...});"
  # To avoid people typing any type of thing and sendting unknow parameters to the database, we will refine the 'req.query' by doing something like this:
  <code>
    bookRouter.route('/books')
      .get(function(req, res) {

        var query = {};
        if(req.query.genre) {
          // only add the genre filter parameter if it exists on the URL
          // if you type "books?batata=Something", the parameter 'batata' will not be passed to the query for the Book
          query.genre = req.query.genre;
        }

        Book.find(query, function(err, books) {
          if(err) {
            res.status(500).send(err);
          } else {
            res.json(books);
          }
        });

      });
  </code>

______
# Part 3.3

  # We are going to add an route that gives us only one result of book by giving its id, and its URL should looks like:
  # 'localhost:8000/api/books/:bookId' or 'localhost:8000/api/books/16516161561561'

  # Go to your 'app.js' and just after the '/books' route, add the following code:
  <code>
    bookRouter.route('/books/:bookId')
      .get(function(req, res) {
        var bookId = req.params.bookId; // example of ObjectId(type of id used by MongoDB): 56c9d11d3b6c8e7e9977b55d
        Book.findById(bookId, function (err, book) {
          if(err) {
            res.status(500).send(err);
          } else {
            res.json(book);
          }
        });
      });
  </code>

  # Then go to your browser and navigate to: 'localhost:8000/api/books/56c9d11d3b6c8e7e9977b55d'
  # To get an different ObjectId, go to your console and type "mongo" to open the mongo shell and then write
  > new ObjectId();

  # And copy and paste it

_______
# Part 4
  # Now we are going to implement the post function which lets us add new books to our model.
  # Go on 'app.js' on the 'book_api/' folder and just below the '/books' routes, chain a new http verbe method:

  <code>
    var bookRouter = express.Router();
    bookRouter.route('/books')
      // BEGIN: new code
      .post(function (req, res) {
        var book = new Book();


      })
      // END: new code
      .get(function(req, res) {
        //...
  </code>

  # Before we move on, in order to translate the client data received from the request, we need an middleware called "body-parser", which
  will translate the json passed from the request to the Book model.
  # Go to your console inside '/book_api' and tap:
  > npm install body-parser --save

  # Add that library to our 'app.js' and tells expressjs to use it on our app by doing:
  <code>
    var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'); // ADD THE BODY PARSER LIBRARY


    // ...
      var app = express();
      var port = process.env.PORT || 3000;

      // BEGIN: new code
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      // END: new code
    // ...
  </code>

  # Now, we are almost done from inserting a new book.
  # Go on and update the '.post' function code:
  <code>
    .post(function (req, res) {
      var book = new Book(req.body); // This is where body-parser is working on

      book.save();
      res.status(201).send(book);
    })
  </code>

  # Open up your postman, insert the url: "http://localhost:8000/api/books", on the headers "Content-Type":"application/json", method "POST"
  # and on the body:
  {
    "title": "O pequeno príncipe",
    "genre": "Drama",
    "author": "Matheus Hayashi",
    "read": false
  }

  # The request will return the newly created book with an id key, just like this:
  {
    "title": "O pequeno príncipe",
    "genre": "Drama",
    "author": "Matheus Hayashi",
    "_id": "56ca51f7f8892fb7329d208b",
    "read": false
  }

  # And now, to see that the was really created, change to method "GET" and the url "http://localhost:8000/api/books" and see your
  # newly created book being returned.

______
# Part 4.1 - Cleaning up

# Our 'app.js' is getting very big having a lot of responsabilities that it shouldn't have.
# We can splice some things up on diferent files, by creating a "routes" folder and extracting the bookRouter from 'app.js' to a file named 'book_routes.js'
> cd books_api
> mkdir routes && cd routes/
> touch book_routes.js

# book_routes.js
  <code>
  var express = require('express');

  // We are creating the 'book_routes.js' as a function because if we want to test it, we can inject our models on our function
  var routes = function() {
    var bookRouter = express.Router();


    bookRouter.route('/books')
      .post(function (req, res) {
        var book = new Book(req.body);

        book.save();
        res.status(201).send(book);
      })
      .get(function(req, res) {

        var query = {};
        if(req.query.genre) {
          query.genre = req.query.genre;
        }

        Book.find(query, function(err, books) {
          if(err) {
            res.status(500).send(err);
          } else {
            res.json(books);
          }
        });
      });


    bookRouter.route('/books/:bookId')
      .get(function(req, res) {
        var bookId = req.params.bookId; // example: 56c9d11d3b6c8e7e9977b55d
        Book.findById(bookId, function (err, book) {
          if(err) {
            res.status(500).send(err);
          } else {
            res.json(book);
          }
        });
      });


    return bookRouter;
  }

  module.exports = routes;
  </code>

# app.js
# Notice that we have extracted all of the bookRouter logic to a new file:
  <code>
    var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');


    var db = mongoose.connect("mongodb://localhost/bookAPI");
    var Book = require('./models/bookModel');


    var app = express();
    var port = process.env.PORT || 3000;

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());


    // BEGIN: new code
    // we need to have a '()' after the require because we are exporting a function on 'module.exports' and our logic is inside that function
    // in order to get it, we must execute it to get that function return
    var bookRouter = require('./routes/book_routes.js')();
    app.use('/api', bookRouter);
    // END: new code

    app.get('/', function(req, res) {
      res.send("Hello world");
    });

    app.listen(port, function() {
      console.log("Express.js server running on port: " + port);
    });
  </code>

# If you try to test it on Postman, you will notice an error: "Book is not defined"
# which means that the "book_routes.js" doesn't have any idea of what "Book"(model) is!
# We need to inject it.

# On 'book_routes.js', add the parameter 'Book' to your function
# 'book_routes.js'
var routes = function(Book) {
  var bookRouter = express.Router();

# On 'app.js', add the 'Book' model on the require call to the 'book_routes':
# app.js
var bookRouter = require('./routes/book_routes.js')(Book); // now '(Book)' instead of '()'

# Go to postman and tries any of our routes and see that it is working like a charm.
# The last refactor that we can do, is to let the 'app.use' take care of the routes naming.
# on the 'book_routes.js', remove the 'books' text from the '/books' and '/books/:bookId' routes name
  # 'book_routes.js'
  // ...
  bookRouter.route('/')
    .post(function (req, res) {

  // ..
  bookRouter.route('/:bookId')


  # and on 'app.js', modify the 'app.use' to handle that naming
  # app.js
    // ..
    app.use('/api/books', bookRouter); // Instead of "app.use('/api', bookRouter);"


    ----
    > npm install gulp-mocha should sinon --save
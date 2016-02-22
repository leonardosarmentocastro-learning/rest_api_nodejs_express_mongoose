var express = require('express'),
mongoose = require('mongoose'),
bodyParser = require('body-parser');


var db = mongoose.connect("mongodb://localhost/bookAPI");
var Book = require('./models/bookModel');


var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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

app.use('/api', bookRouter);

app.get('/', function(req, res) {
  res.send("Hello world");
});

app.listen(port, function() {
  console.log("Express.js server running on port: " + port);
});
var express = require('express');

// We are creating the 'book_routes.js' as a function because if we want to test it, we can inject our models on our function
var routes = function(Book) {
  var bookRouter = express.Router();


  bookRouter.route('/')
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


  bookRouter.route('/:bookId')
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
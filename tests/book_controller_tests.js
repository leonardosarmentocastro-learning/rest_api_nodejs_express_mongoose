var should = require('should'),
sinon = require('sinon');

describe('Book Controller Tests: ', function() {
  describe('Post', function() {
    it('should now allow an empty title on post', function() {
      // Create a simple Book model to serve as a mock since the Book.save() method is called inside the 'post' method
      var mockBook = function(book) {
        this.save = function() {}
      };

      // Used on "new Book(req.body);" so we are actually need it to create a new Book for the test
      var mockReq = {
        body: {
          author: 'Jon'
        }
      };

      // Called on "res.status(201).send(book);" and since we want to check if its called with "x" parameters, we use "sinon" for that
      var mockRes = {
        status: sinon.spy(),
        send: sinon.spy()
      }

      var bookController = require('../controllers/book_controller')(mockBook);

      bookController.post(mockReq, mockRes);

      mockRes.status.calledWith(400).should.equal(true, 'Bad status ' + mockRes.status.args[0][0]);
      mockRes.send.calledWith('Title is required').should.equal(true);
    });
  });
});
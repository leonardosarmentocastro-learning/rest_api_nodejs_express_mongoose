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

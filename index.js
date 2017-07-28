var express = require("express");
var parser = require("body-parser");

var app = express();
app.use(parser.urlencoded({extended:false}));
app.use(parser.json());
app.listen((process.env.PORT || 5000));
app.use(express.static(__dirname + '/app'));

var fbRouter = require('./app/js/routes/fb-response.js');

// application routes
app.get('/', function(req, res){
    res.render("index.html");
});

// facebook routes
app.use('/fbresponse', fbRouter);

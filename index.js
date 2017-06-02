var express = require("express");
var request = require("request");
var parser = require("body-parser");

var app = express();
app.use(parser.urlencoded({extended:false}));
app.use(parser.json());
app.listen((process.env.PORT || 5000));

app.get('/', function(req, res){
    res.send("Application deployed !!!");
});

app.get('/webhook/',function(res, req){
    if(req.query["hub.verify_token"] === "sample_token"){
        console.log("webhook verification success !!");
        res.status(200).send(req.query["hub.challenge"]);
    }else{
        console.log("webhook verification failed !!");
        res.sendStatus(403);
    }
});
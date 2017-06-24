var express = require("express");
// var request = require("request");
var parser = require("body-parser");
// var token = "EAASq8a5TmXcBALKEzjGSZChpmRtz2YFtSZBHZCLvmney0vSbJczTjNLwfjIvLtzOStxODMK0BhkGRwKBcehnLBdJ3Fu6ahBdOpN2wuoBcKBuqXolXOJekK2b6DthrkFuA6bVsU71ZCt9FW2fr7wIyRRZB3qh0ul9srazhw1IHogZDZD";
var app = express();
app.use(parser.urlencoded({extended:false}));
app.use(parser.json());
app.listen((process.env.PORT || 5000));
app.use(express.static(__dirname + '/app'));

var fbRouter = require('./app/js/fb-response.js');

// application routes
app.get('/', function(req, res){
    res.render("index");
});

// facebook routes
app.use('/fbresponse', fbRouter);

// app.get('/webhook/',function(req, res){
//     if(req.query["hub.verify_token"] === "sample_token"){
//         console.log("webhook verification success !!");
//         res.status(200).send(req.query["hub.challenge"]);
//     }else{
//         console.log("webhook verification failed !!");
//         res.sendStatus(403);
//     }
// });

// app.post('/webhook/', function(req, res){
//     var messaging_events = req.body.entry[0].messaging;

//     for(var i=0; i< messaging_events.length; i++){
//         var event = messaging_events[i];
//         var sender = event.sender.id;
//         if(event.message && event.message.text){
//             let text = event.message.text;
//             sendText(sender, "Text echo : "+ text.substring(0, 100));
//         }
//     }
//     res.sendStatus(200);
// });

// function sendText(sender, text){
//     var messageData = {text : text};
//     request({
//         url:"https://graph.facebook.com/v2.6/me/messages",
//         qs:{access_token: token},
//         method: "POST",
//         json:{
//             recipient:{id:sender},
//             message:messageData
//         }
//     }, function(error, response, body){
//         if(error){
//             console.log("Sending Error: ",error);
//         }else if (response.body.error){
//             console.log("response body error: ",response.body.error);
//         }
//     });
// }
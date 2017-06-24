var express = require('express');
var router = express.Router();

var request = require("request");
var token = "EAASq8a5TmXcBALKEzjGSZChpmRtz2YFtSZBHZCLvmney0vSbJczTjNLwfjIvLtzOStxODMK0BhkGRwKBcehnLBdJ3Fu6ahBdOpN2wuoBcKBuqXolXOJekK2b6DthrkFuA6bVsU71ZCt9FW2fr7wIyRRZB3qh0ul9srazhw1IHogZDZD";
var verify_token = "sample_token";


router.get('/webhook/',function(req, res){
    if(req.query["hub.verify_token"] === verify_token){
        console.log("webhook verification success !!");
        res.status(200).send(req.query["hub.challenge"]);
    }else{
        console.log("webhook verification failed !!");
        res.sendStatus(403);
    }
});

router.post('/webhook/', function(req, res){
    var messaging_events = req.body.entry[0].messaging;

    for(var i=0; i< messaging_events.length; i++){
        var event = messaging_events[i];
        var sender = event.sender.id;
        if(event.message && event.message.text){
            let text = event.message.text;
            sendText(sender, "Text echo : "+ text.substring(0, 100));
        }
    }
    res.sendStatus(200);
});

function sendText(sender, text){
    var messageData = {text : text};
    request({
        url:"https://graph.facebook.com/v2.6/me/messages",
        qs:{access_token: token},
        method: "POST",
        json:{
            recipient:{id:sender},
            message:messageData
        }
    }, function(error, response, body){
        if(error){
            console.log("Sending Error: ",error);
        }else if (response.body.error){
            console.log("response body error: ",response.body.error);
        }
    });
}

router.get('/text', function(req, res){
    res.send('This is text response to fb chatbot');
});

module.exports = router;
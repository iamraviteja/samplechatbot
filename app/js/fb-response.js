var express = require('express');
var router = express.Router();

var utils = require('./utils/utils.js');

var request = require("request");
var token = "EAASq8a5TmXcBALKEzjGSZChpmRtz2YFtSZBHZCLvmney0vSbJczTjNLwfjIvLtzOStxODMK0BhkGRwKBcehnLBdJ3Fu6ahBdOpN2wuoBcKBuqXolXOJekK2b6DthrkFuA6bVsU71ZCt9FW2fr7wIyRRZB3qh0ul9srazhw1IHogZDZD";
var verify_token = "sample_token";

// chatbot response object
var resObj = {
    url:"https://graph.facebook.com/v2.6/me/messages",
    qs:{access_token: token},
    method: "POST"
};

// response error handler
var resErrorHandler = function(error, response, body){
    if(error){
        console.log("Sending Error: ", error);
    }else if(response.body.error){
        console.log("Response Body Error:", response.body.error);
    }
};

var currentTopic;
var resActionHandler = {
    GREETING:function(sender){
        sendButtonTemplate(sender, 'Hi welcome to trivia chatbot. what would you like to do ?',[
            {
                type:'postback',
                title:'Get Questions',
                payload:'GET_QUESTIONS'
            },
            {
                type:'postback',
                title:'Set Topic',
                payload:'CHANGE_TOPIC'
            }
        ]);
    },
    GET_QUESTIONS:function(sender){
        sendText(sender, "Text echo : "+sender+" GET_QUESTIONS");
    },
    CHANGE_TOPIC:function(sender){
        let title;
        if(!currentTopic){
            title = 'Looks like no topic is set would you like to set a topic';
        }else{
            title = 'The current topic set is : '+currentTopic+' would you like to change it';
        }

        sendButtonTemplate(sender, title,[
            {
                type:'postback',
                title:'Sports',
                payload:'SET_TOPIC:Sports'
            },
            {
                type:'postback',
                title:'Books',
                payload:'SET_TOPIC:Books'
            },
            {
                type:'postback',
                title:'Film',
                payload:'SET_TOPIC:Film'
            }
        ]);
    },
    REFRESH_TOPIC:function(sender){
        sendText(sender, "Text echo : REFRESH_TOPIC");
    },
    DEFAULT:function(sender){
        sendQuickReplies(sender);
    },
}


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

        console.log("Event : ++++++++++++ ",event);

        if(event.message && event.message.text){
            let text = event.message.text;
            let resAction = utils.getAction(text);
            if(resActionHandler[resAction]){
                resActionHandler[resAction](sender);
            }else{
                sendText(sender, "Text echo : "+ resAction);
            }
        }else if (event.message){
            console.log('send quick reply');
            sendQuickReplies(sender);
        }

        if(event.postback && event.postback.payload){
            let payload = event.postback.payload;
            if(resActionHandler[payload]){
                resActionHandler[payload](sender);
            }else{
                sendText(sender, "Text echo : "+ payload);
            }
        }else if(event.postback){
            console.log('send quick reply');
            sendQuickReplies(sender);
        }
    }
    res.sendStatus(200);
});

function sendText(sender, text){

    var messageData = {text : text};

    var response = utils.clone(resObj);
    response["json"] = {
        recipient:{id:sender},
        message:messageData
    }

    request(response, resErrorHandler);
};

function sendButtonTemplate(sender,title, buttons){
    var messageData = {
        attachment:{
            type:'template',
            payload:{
                template_type:'button',
                text:title,
                buttons:buttons
            }
        }
    };

    var response = utils.clone(resObj);
    response["json"] = {
        recipient:{id:sender},
        message: messageData
    }
    request(response, resErrorHandler);
};

function sendQuickReplies(sender){
    var messageData = {
        text:"Did you mean",
        quick_replies :[
            {
                content_type:"text",
                title:"Get Questions",
                payload:"GET_QUESTIONS"
            },
            {
                content_type:"text",
                title:"Change Topic",
                payload:"CHANGE_TOPIC"
            },
            {
                content_type:"text",
                title:"Refresh Questions",
                payload:"REFRESH_TOPIC"
            }
        ]
    };

    var response = utils.clone(resObj);
    response["json"] = {
        recipient:{id:sender},
        message: messageData
    }
    request(response, resErrorHandler);
};

router.get('/text', function(req, res){
    res.send('This is text response to fb chatbot');
});

module.exports = router;
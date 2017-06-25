// contains the utility function of the application
/*
1) clone object function
*/

var utils = {};

var qbank = [
    {
        question:['hi', 'hey', 'how are you?','get me questions'],
        action:'GREETING'
    },
    {
        question:['get me questions', 'questions'],
        action:'GET_QUESTIONS'
    },
    {
        question:['change', 'change topic', 'boring'],
        action:'CHANGE_TOPIC'
    },
    {
        question:['refresh', 'refresh questions', 'refresh topic', 'reset', 'reset topic'],
        action:'REFRESH_TOPIC'
    }
];

utils["getAction"] = function(q){
    let retAction = qbank.forEach(function(el,index){

        let isMatch = el.question.forEach(function(ques,i){
            if(ques == q.toLowerCase())  return true;
            if(i === el.question.length - 1 ) return false;
        });
        
        if(isMatch) return el.action;
        if(index === el.length - 1) return 'DEFAULT';
    });

    return retAction;
}

utils["cloneObj"] = function(obj){
    var copy = {};
    for(var attr in obj){
        if(obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }

    return copy;

}

utils["clone"] = function(obj){

    if( null == obj || 'object' != typeof obj) return obj;

    // handle object
    if(obj instanceof Object) return utils.cloneObj(obj);

    // unsupported type
    throw new Error("Unable to Clone : unsuported type");

}

module.exports = utils;
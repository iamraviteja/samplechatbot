// contains the utility function of the application
/*
1) clone object function
*/

var utils = {};

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
    if(obj instanceof object) return utils.cloneObj(obj);

    // unsupported type
    throw new Error("Unable to Clone : unsuported type");

}

module.exports = utils;
/*REFINERY entry */
var xmljson=require('./xmljson'); 
var ame=require('./ame'); 
var version=require('./package.json').version;
module.exports={ame:ame,xmljson:xmljson,  version:version};
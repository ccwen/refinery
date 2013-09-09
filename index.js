/*REFINERY entry */
var xmljson=require('./xmljson'); 
var ame=require('./ame'); 
var api=require('./refinery_api')
var version=require('./package.json').version;
module.exports={ame:ame,xmljson:xmljson, api:api, version:version};
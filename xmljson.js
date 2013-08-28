//var sax=require('sax');
var splitter=require('yase').splitter;
var xml2json=function(str) {
	var splitted=splitter(str);
	var json=[], tagstack=[], selfclosing=false, text="";

	for (var i in splitted.tokens) {
		var tk=splitted.tokens[i];

		if (tk[0]=='<' ) {
			if (text) {json.push(text); text=""}
			if (tk[1]=='/') {
				tk=tk.substring(2,tk.length-1);
				if (tk!=tagstack[tagstack.length-1]) throw 'tag unbalance'+tk;
				json.push("\0");
				tagstack.pop();
			} else {
				tk=tk.substring(1,tk.length-1);
				json.push("\0"+tk);

				selfclosing=tk.substr(tk.length-1) == '/'

				var attrpos=tk.indexOf(" ");
				if (attrpos>-1) tk=tk.substring(0,attrpos);

				if (!selfclosing) tagstack.push(tk);
			}
		} else {
			text+=tk;	
		}
	}
	if (text) json.push(text);
	while (json[json.length-1]=="\0") {
		json.pop();
	}	
	return json;
}

var json2xml=function(arr) {
	var output="";
	var tagstack=[];
	for (var i in arr) {
		var t=arr[i];
		if (t.charCodeAt(0)==0) {
			var tagname=t=t.substring(1);
			var attrpos=t.indexOf(" ");
			if (attrpos>-1) tagname=t.substring(0,attrpos);
			tagstack.push(tagname)
			output+='<'+t+'>';
		} else {
			output+=t;
		}
	}
	while (tagstack.length) {
		output+='</'+tagstack.pop()+'>';
	}

	return output;
}
module.exports={parse:xml2json, stringify:json2xml};
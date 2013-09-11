var fs=require('fs');
var persistent=require('./persistent');
var Yaseuse=require('yase').use;

var listfiles=function(path, prefix, ext) {
	ext=ext||".ydb";
	var output=[];
	var files=fs.readdirSync(path);
	for (var i in files) {
		var stat=fs.statSync(path+files[i]);
		if (!stat) continue;
		if (stat.isDirectory()) continue;
		if (files[i].substring(0,prefix.length)==prefix &&
		    files[i].substring(files[i].length-3)==ext) {
			output.push(files[i]);
		}
	}		
	return output;
}

var save=function(opts,callback) {
	var db=Yaseuse(opts.db);
	if (!db) return null;
	var nslot=Math.floor(opts.markups[0].vpos / 4096); //better use selector , because user might send empty
	var T=db.closestTag("xml",nslot);
	var src=db.getTagAttr(T.name,T.ntag,"src");
	if (!src) return {msg:'error file name'};
    var fn='aem/'+opts.db+'/'+src.substring(0,src.length-4)
    +'-'+opts.role+'-'+opts.author+'.aem';

    var res=persistent.merge(fn,opts.markups, 
    		{ removed:opts.removed,start: T.slot, 
    		  signature:{slotcount:db.meta.slotcount, tokencount:db.meta.tokencount}
    		}
    	);
    callback(0,res); //in the future, save is async
}
save.async=true;

var load=function(opts,callback) {
	var db=Yaseuse(opts.db);
	if (!db || !opts.selector) return null;

	var starttag=db.findTagBySelector(opts.selector);
	if (!starttag) return null;

	var T=db.closestTag("xml",starttag.slot);	

	var src=db.getTagAttr(T.name,T.ntag,"src");
	if (!src) return {msg:'error file name'};
	var path='aem/'+opts.db+'/';
	var prefix=src.substring(0,src.length-4)+'-'+opts.role+'-';
	if (opts.author) {
	    var fn=path+prefix+opts.author+'.aem';
	    var res=persistent.load(fn, {start: T.slot});
	} else { //merge multiple files
		var files=listfiles(path,prefix,'aem');
		var res={markups:[]};
		for (var i in files) {
			var loaded=persistent.load(path+files[i], {start: T.slot});
			//TODO need to check the header
			res.markups=res.markups.concat(loaded.markups);
		}
	}
	if (res) callback(0,res);
}
load.async=true;

var initialized=false;
var installservice=function(services) { // so that it is possible to call other services
	var API={ 
		save:save,
		load:load,
		version: function() { return require('./package.json').version }
	};

	if (!initialized && services) {
		services['refinery']=API;
		initialized=true;
	}
	return API;
}
module.exports=installservice;

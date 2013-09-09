/*
	GITHUB friendly persistent layer for AEM,
	AEM from same source XML will be grouped into a single file.
	aem are sorted by vpos.
*/
var fs=require('fs');
var version=require('./package.json').version;

var merge=function(fn,aemarray, opts) {
	var loaded=load(fn);
	loaded.header.build++;
	loaded.markups=loaded.markups.concat(aemarray);
	save(fn,loaded.markups, {header:loaded.header} );
}
var load=function(fn) {
	var loaded=JSON.parse(fs.readFileSync(fn,'utf8'));
	if (!loaded) return null;
	if (loaded.header.start) {
		var voff=loaded.header.start*4096;
		loaded.markups=loaded.markups.map(function(m) {m.vpos+=voff;return m});
	}
	for (var i in loaded.markups) {
		loaded.markups[i].id=loaded.markups[i].vpos+loaded.markups[i].tag;
	}
	return loaded;
}
var save=function(fn, aemarray, opts) {
	aemarray=JSON.parse(JSON.stringify(aemarray));
	if (!opts.header.build) opts.header.build=1;
	var output='{"version":"'+version+'","header":'+JSON.stringify(opts.header)+',\n'
	aemarray=aemarray.sort(function(a,b) {return a.vpos-b.vpos });
	if (opts.header.start ) { //offset  from starting slot
		var voff=opts.header.start*4096;
		aemarray=aemarray.map(function(m) {m.vpos-=voff;return m});
	}
	for (var i=0;i<aemarray.length;i++) {
		if (i) output+=','; else output+='"markups":[\n ';
		delete aemarray[i].id;
		output+=JSON.stringify(aemarray[i])+'\n';
	}
	output+=']\n}';
	fs.writeFileSync(fn,output,'utf8');
}
module.exports={merge:merge, load: load, save:save};
/*
	GITHUB friendly persistent layer for AEM,
	AEM from same source XML will be grouped into a single file.
	aem are sorted by vpos.
*/
var fs=require('fs');
var version=require('./package.json').version;

function array_unique(nav_array) {
    nav_array = nav_array.sort(function (a, b) { return a.vpos - b.vpos; });      
    var ret = [nav_array[0]];       
    // Start loop at 1 as element 0 can never be a duplicate
    for (var i = 1; i < nav_array.length; i++) { 
        if (nav_array[i-1].vpos !== nav_array[i].vpos) {
            ret.push(nav_array[i]);             
        }       
    }
    return ret;     
}
var removenull=function(A) {
	var out=[];
	A.map(function(m) {if (m) out.push(m)} );//removed null item
	return out;
}

var merge=function(fn,aemarray, opts) {
	opts=opts||{};
	var A=null;//output;
	if (fs.existsSync(fn)) {
		var loaded=load(fn);

		loaded.header.build++;
		var idarray=loaded.markups.map(function(e) { return e.id; }); //need optimize to sorted array 
		if (opts.removed) { //load from file but removed by users
			for (var i=0;i<opts.removed.length;i++) {
				var pos = idarray.indexOf( opts.removed[i].id);
				if (pos>-1) delete loaded.markups[pos];
			}
		}	
		//now combine the newly added markup and uniquefy
		A=array_unique(aemarray.concat(removenull(loaded.markups)));
		//merge header 
		for (var i in loaded.header) opts[i]=loaded.header[i];
	} else {
		A=removenull(aemarray);
	}

	if (opts.removed) delete(opts.removed);
	save(fn,A, {header:opts} );
}
var load=function(fn) {
	if (!fs.existsSync(fn)) return null;
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
		delete aemarray[i].fromdisk;
		output+=JSON.stringify(aemarray[i])+'\n';
	}
	output+=']\n}';
	fs.writeFileSync(fn,output,'utf8');
}
module.exports={merge:merge, load: load, save:save};
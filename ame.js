//var sax=require('sax');
var customfunc=require('yase').customfunc;

var deflate=function(tagged,startslot) {
	var texts=[],tags=[];
	for (var i=0;i<tagged.length;i++) {
		texts[i]=[];
		for (var j=0;j<tagged[i].length;j++) {
			var t=tagged[i][j];
			
			if (t[0]!='<') {
				texts[i].push(t);
			} else {
				tags.push({ tag:t, soff:i, toff: texts[i].length } );
			}
		}
	}
	return {texts:texts,tags:tags}
}
var processTag=function(ame,state) {
	if (ame.tag=="DEL") {
		state.text="";
	} else if (ame.tag=="INS") {
		state.text+=ame.text;
	} else {
		state.push=ame.tag;
	}
}
var inflate=function(texts,arrtags) {
	//SORT tags if needed.
	var tagged=[];
	var now=new Array(arrtags.length);
	for (var i in arrtags) now[i]=0;

	var applyame=function(i,j) {
		var state={ text: texts[i][j]};
		if (typeof state.text=='undefined') state.text='';
		for (var k=0;k<arrtags.length;k++) {
			while (now[k]<arrtags[k].length &&
				arrtags[k][now[k]].soff==i && arrtags[k][now[k]].toff==j) {
				var ame=arrtags[k][now[k]];
				processTag(ame,state);
				if (state.push) {
					tagged[i].push(state.push);
					state.push=null;
				}
				now[k]++;
			}
		}
		//apply tag
		return state.text;
	}

	for (var i=0;i<texts.length;i++) {
		tagged[i]=[];
		for (var j=0;j<texts[i].length;j++) {
			tagged[i].push(applyame(i,j));
		}
		t=applyame(i,j);
		if (t) tagged[i].push(t)
	}
	return tagged;
}

module.exports={deflate:deflate,inflate:inflate};
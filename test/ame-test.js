var vows = require('vows'),
    assert = require('assert'),
    ame=require('../ame'),
    Yase=require('yase');
var fs=require('fs')

vows.describe('ame test').addBatch({
 'simple': {
    topic: function () {
    	return Yase.use("./testdb",{nowatch:true});
    },
	deflate:function(topic) {
		topic.page=topic.getTextByTag({db:"./testdb",tag:'pb',attribute:'id',value:"1.1",
            slotarray:true,tokenarray:true,extraslot:1})
        topic.deflated=ame.deflate(topic.page.text);
        //console.log(page)
        //console.log(res)
        assert.deepEqual( topic.deflated.texts[0],['內','容','一\n'] );
	},
    inflate:function(topic) {
        //console.log(topic.deflated)
        var inflated=ame.inflate(topic.deflated.texts, [topic.deflated.tags] );
        assert.deepEqual( inflated, topic.page.text);
    },
    merge:function(topic) {
        var thetag='<tag/>';
        var mytags=[{tag:thetag, soff:0, toff:0 }]
        var inflated=ame.inflate(topic.deflated.texts, [topic.deflated.tags,mytags] );
        topic.page.text[0].unshift(thetag);
        assert.deepEqual( inflated, topic.page.text);
        //console.log(inflated)
        topic.page.text[0].shift();
    }
  },
  'text modifier':{
    topic: function () {
        return Yase.use("./testdb",{nowatch:true});
    },
    deflate:function(topic) {
        topic.page=topic.getTextByTag({db:"./testdb",tag:'pb',attribute:'id',value:"1.1",
            slotarray:true,tokenarray:true,extraslot:1})
        topic.deflated=ame.deflate(topic.page.text);
    },
    deletetext:function(topic) {
        var mytags=[{tag:"DEL", soff:1, toff:0 }]
        var inflated=ame.inflate(topic.deflated.texts, [topic.deflated.tags,mytags] );
        console.log(inflated[1].join(""))
        assert.deepEqual( inflated[1].join(""),"<sutra>一</sutra>\n");
    },
    inserttext:function(topic) {
        var mytags=[{tag:"INS", soff:1, toff:0 , text:"第"}]
        var inflated=ame.inflate(topic.deflated.texts, [topic.deflated.tags,mytags] );
        console.log(inflated[1].join(""))
        assert.deepEqual( inflated[1].join(""),"<sutra>經第一</sutra>\n");
    },
    inserttext_atend:function(topic) {
        var mytags=[{tag:"INS", soff:1, toff:2 , text:"經"}]
        var inflated=ame.inflate(topic.deflated.texts, [topic.deflated.tags,mytags] );
        console.log(inflated[1].join(""))
        assert.deepEqual( inflated[1].join(""),"<sutra>經一</sutra>\n經");
    },    
    modifytext:function(topic) {
        var mytags=[{tag:"DEL",soff:1,toff:0},{tag:"INS", soff:1, toff:0 , text:"第"},{tag:"INS", soff:1, toff:1 , text:"經"}]
        var inflated=ame.inflate(topic.deflated.texts, [topic.deflated.tags,mytags] );
        console.log(inflated[1].join(""))
        assert.deepEqual( inflated[1].join(""),"<sutra>第一經</sutra>\n");
    }
  }
 
    
}).export(module); // Export the Suite
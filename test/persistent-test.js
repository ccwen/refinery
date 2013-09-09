var vows = require('vows'),
    assert = require('assert'),
    persistent=require('../persistent');
var fs=require('fs')

vows.describe('ame persistent test').addBatch({
 'saveandload': {
    topic: function () {
    	return [
    		 {tag: "typo",vpos: 449183748,id: "449183748typo"}
			,{tag: "typo",vpos: 449191947,id: "449191947typo"}
    	];
    },
	saveandload:function(topic) {
		var fn='test.aem';
		persistent.save(fn,topic,{header:{date:new Date()}});
		var loaded=persistent.load(fn);
		console.log('KK',loaded.markups)
		assert.deepEqual(loaded.markups,topic);
	}
 },
 'merge':{
    topic: function () {
    	return {before:[
    		 {id: "449190000typo",tag: "typo",vpos: 449190000}
    	],
    	after:[
             {id: "449183748typo",tag: "typo",vpos: 449183748}
    		,{id: "449190000typo",tag: "typo",vpos: 449190000}
			,{id: "449191947typo",tag: "typo",vpos: 449191947}
		]
    };
    },
    merge:function(topic) {
    	var fn='test.aem';
    	persistent.merge(fn,topic.before);
		var loaded=persistent.load(fn);	
		assert.deepEqual(loaded.markups, topic.after);
    }

 }

}).export(module);
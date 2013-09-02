var vows = require('vows'),
    assert = require('assert'),
    xmljson=require('../xmljson');
var fs=require('fs')

vows.describe('xmljson test').addBatch({
 'simple': {
    topic: function () {
    	return xmljson.parse("<xml> xyz </xml>");
    },
	simpletest:function(topic) {
		assert.deepEqual( ["\0xml","xyz "] , topic ,'output');
	},
  },
 'nested': {
    topic: function () {
    	return xmljson.parse("<xml>x<q>y</q>z</xml>");;
    },

	simpletest:function(topic) {
		//console.log('JSON',topic.json)
		assert.deepEqual( ["\0xml","x","\0q","y","\0","z"] , topic,'output');
	},
	},
 'nested2': {
    topic: function () {
        return xmljson.parse("<xml>x<q> y </q></xml>");;
    },

    simpletest:function(topic) {
        //console.log('JSON',topic.json)
        assert.deepEqual( ["\0xml","x","\0q","y "] , topic,'output');
    },
    },
 'empty': {
    topic: function () {
        return xmljson.parse('<xml>x<pb id="1"/>y</xml>');
    },

    simpletest:function(topic) {
   //     console.log('JSON',topic)
        assert.deepEqual( ["\0xml","x",'\0pb id="1"/',"y"] , topic,'output');
    },
    },
 'entity': {
    topic: function () {
        return xmljson.parse('<xml>x&kxr;y</xml>');
    },

    simpletest:function(topic) {
   //     console.log('JSON',topic)
        assert.deepEqual( ["\0xml","x&kxr;y"] , topic,'output');
    },
    },
 'attribute': {
    topic: function () {
    	return xmljson.parse('<xml a="pp" b="qq">xyz</xml>');
    },

	simpletest:function(topic) {
		//console.log('JSON',topic.json)
		assert.deepEqual( ['\0xml a="pp" b="qq"',"xyz"] , topic ,'output');
	},
	},

 'reverse': {
    topic: function () {  
      return xmljson.stringify(['\0xml a="pp"',"xyz","\0"] ) ;
    },

    simpletest:function(topic) {
        console.log(topic)
       assert.equal( ['<xml a="pp">xyz</xml>'] , topic ,'output');
    },
    },
 'reverse2': {
    topic: function () {  
      return xmljson.stringify(['\0xml a="pp"',"p\n", "\0q", "xyz"] ) ;
    },

    simpletest:function(topic) {
        console.log(topic)
       assert.equal( ['<xml a="pp">p\n<q>xyz</q></xml>'] , topic ,'output');
    },
    }    
    
}).export(module); // Export the Suite
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
		console.log('JSON>',topic)
		assert.deepEqual( ["\0xml"," xyz "] , topic ,'output');
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
        assert.deepEqual( ["\0xml","x","\0q"," y "] , topic,'output');
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
      return xmljson.stringify(['\0xml a="pp"',"xyz"] ) ;
    },

    simpletest:function(topic) {
       assert.equal( ['<xml a="pp">xyz</xml>'] , topic ,'output');
    },
    }
    
}).export(module); // Export the Suite
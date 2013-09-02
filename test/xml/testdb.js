console.log(require('yase').build({
	dbid:'sample',
	blockshift:7,
	schema:function() {
		this.toctag(["sutra","chapter"])
		      .emptytag("pb").attr("pb","id",{"depth":2})
		      .attr("chapter","n",{"depth":1,"allowrepeat":true});
	},  
	input:'testdb.xml',
	output:'../testdb.ydb',
	author:'yapcheahshen@gmail.com',
	version:'0.0.2',
	outputencoding:'ucs2',
	estimatesize:100000
	 //maxfile:0  //
}));
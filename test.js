var http = require('http');
var fs = require('fs');


var documentRoot = '/Users/guzhenfu/Documents/ionic/IonicDemo/www';


http.createServer(function (request, response) {
	var url = request.url;


  console.log(url.length);

	if(url.length <= 1){
		url = "/index.html";
	}

  var file = documentRoot + url;

	console.log(url);
	console.log(file);
	fs.readFile(file, function(err, data) {
		if (err){
      console.log(err);
			response.writeHeader(404, {
				'content-type':'text/html;charset="utf-8"'
			});
			response.write('<h1>404</h1><p>not found</p>');
			response.end();
		}else{
			response.writeHeader(200, {
				'content-type':'text/html;charset="utf-8"'
			});
			response.write(data);
			response.end();
		}
	})
}).listen(8889);

console.log('Server running ');

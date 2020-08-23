var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');

var httpsOptions = {
    key: fs.readFileSync('/Users/ciaolink/localhost-key.pem'),
    cert: fs.readFileSync('/Users/ciaolink/localhost.pem')
};

var app = function(request, response) {

	var filePath = '.' + request.url;
	if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        case '.ico':
        	contentType = 'image/x-icon';
        	break;
        case '.ico':
        	contentType = 'image/x-icon';
        	break;
        case '.ico':
        	contentType = 'image/x-icon';
        	break;
        case '.mp3':
        	contentType = 'audio/mpeg';
        	break;
        case '.svg':
        	contentType = 'image/svg+xml';
        	break;
        case '.svg':
        	contentType = 'application/pdf';
        	break;
        case '.doc':
        	contentType = 'application/msword';
        	break;
        case '.ttf':
        	contentType = 'application/font-sfnt';
        	break;
        case '.eot':
        	contentType = 'application/vnd.ms-fontobject';
        	break;

    }

    console.log(request.method + ' ' + response.statusCode + ' ' + filePath);

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {


        	response.setHeader('Access-Control-Allow-Origin', '*');

			// Request methods you wish to allow
			response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

			// Request headers you wish to allow
			response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

			// Set to true if you need the website to include cookies in the requests sent
			// to the API (e.g. in case you use sessions)
			response.setHeader('Access-Control-Allow-Credentials', true);

            response.writeHead(200, { 'Content-Type': contentType });

            response.end(content, 'utf-8');


        }
    });

}

http.createServer(app).listen(8888);
https.createServer(httpsOptions, app).listen(4433);
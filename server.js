var http = require('http');
var fs = require('fs');

//Port number where the server listens, add this to the URL like 'http://localhost:8080'
const port = 8080;

/*
 * Write response to the client
 */
const writeResponse = function(response,url) {
    //Write response headers based on the file type we're serving
    writeResponseHeader(response, url);

    fs.readFile('public' + url, function(err, html) {
        if (err) {
            console.log("Error in writeResponse: " + err);
            //Something went wrong, likely the url that the client is asking doesn't exists
            writeErrorResponse(response);
        } else {
            response.write(html);
        }
        response.end();
    });
};

 const writeResponseHeader = function(response, url) {
     response.statusCode = 200;
     if (url.endsWith('.css')) {
         response.setHeader('Content-Type', 'text/css');
     } else if (url.endsWith('.js')) {
         response.setHeader('Content-Type', 'application/javascript');
     } else {
         response.setHeader('Content-Type', 'text/html');
     }
 }

const writeErrorResponse = function(response) {
    //Tell the client that there's no such resource (page) they are asking for
    response.statusCode = 404;
    response.write("Nothing to see here!");
    response.end();
};

const requestHandler = function(request, response) {
    
    "use strict";
    console.log("Received request for URL: " + request.url);

    let url = request.url;
    if (request.url === '/') {
        url = '/index.html'
    }
    writeResponse(response, url);
};

//Create a server with the request handler function
var server = http.createServer(requestHandler);

//Tie the server to port defined in the variable 'port'
server.listen(port, function() {
    console.log("Server listening on address: http://localhost:" + port);
});

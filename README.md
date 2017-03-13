# Let's build a server!
In this workshop we'll build our own simple server and serve our web page using it. We'll use Node.js to code the server and basic web technologies in the web page.

## Project setup
* To implement our server we'll use a backend JavaScript framework called Node.js. Traditionally JavaScript is a language used in the browsers on the client side, but this framework makes it possible to run JS also on the server side.
* The server code is implemented in file called *server.js*. In this file we describe how the server behaves and responds to the requests we get from our browser.
* The files that our server is going to serve to the client are located in the folder called *public*.
* *index.html* file is the front page of our web application and contains the HTML for the page
* *styles.css* is a style file which contains the style descriptions for our HTML
* *script.js* file contains some client side javascript which adds some functionality to our page.


## Get started
* We recommend you use [Chrome](https://www.google.com/chrome/browser/desktop/index.html) browser in this workshop, since we'll demo some of the functionality of the browser tools. But of course you can use any browser you want in case you don't want to install Chrome.
* Install [Node.js](https://nodejs.org/en/): download the installation package from the website and follow the installation instructions.
* Download the source code from this repository to your computer
* You need basically two tools for the workshop: a terminal and an editor for coding. Mac: you can use the build in Terminal application, Windows: you can use the Command Line application.
* Editor: you can use any text editor you like, or you can download a free [Visual Studio Code](https://code.visualstudio.com/) editor which is a good web development environment.
* Open a terminal and navigate to the folder where you put the source code and run the following command:
```
node server.js
```
you should see a output in your terminal saying "Server listening on address: http://localhost:8080".
* You're now ready to start the workshop!

## Task-1
First task is to write a response to the client. We're receiving a request in function ```requestHandler```.
You can see from the terminal what happens every time you refresh the webpage, you should see a line like
"Received request for URL ..." this mean the client is asking for a page from us.

Take a look at the function ```writeResponse```, here we can implement writing the response to the client.
We already have some code there to write the headers in the response, but we actually want to write the html in
the file *public/index.html* every time we get a request.

In order to write a file content to the response,
we need to use the node file system library called 'fs'. There's a function called ```readFile``` which takes
the file name and a callback function which is called after file reading is ready.
The callback takes as a parameter two things: a possible ```err``` object in case something went wrong,
or the content of the file that was read in an object. We can just write the ```html``` object to the response
in case there was no error.

Remember to call the ```end``` function to close the response object properly.

In ```writeResponse``` function:
```
fs.readFile('public/index.html', function(err, html) {
  if (err) {
      response.write("Something went wrong!");
  } else {
      response.write(html);
  }
  response.end();
});
```
Save the changes and try re-loading the web page in your browser, you should now see the page as the HTML describes
in the *index.html*. This means we're writing the content of our *index.html* file to the HTTP response and
the browser is able to render it to the user.

## Task-2
Now that we're serving the *index.html* file nicely, we can see one problem with our implementation.
If you write anything to the URL field on your browser, like http://localhost:8080/thispagedoesntexist
you'll get the same index page (Try it!). This is not really what we want in case we have many pages in our application.

We need to build routing based on the URL the browser is asking for. If the page the client is asking
doesn't exist, we need to show an error message telling that user is looking for something that doesn't exist.

Add a condition to the ```requestHandler``` function to check that the client is asking for the index page ('/' = root of our application) before calling the ```writeResponse``` function.

```
if (request.url === '/') {
    writeResponse(response);
} else {
    writeErrorResponse(response);
}
```

...and implement a ```writeErrorResponse``` function to give an error message to the client:

```
/*
 * Write an error message to the response
 */
const writeErrorResponse = function(response) {
    //Tell the client that there's no such resource (page) they are asking for
    response.statusCode = 404;
    response.write("Nothing to see here!");
    response.end();
};
```
## Task-3
Ok, so we're now serving the page...but it doesn't look so great. We want to make the page look a bit better than it currently does, so for that we have created a stylesheet called *styles.css* located in the same folder as the index file.

Uncomment the ```<link ...href='styles.css'>``` and see what happens next. The page looks the same...but why? You see a line like "Received request for URL: /styles.css" in the terminal,  so the client is now asking for the stylesheet too. But we need to serve the style file too, so far we only have served the index.html file.

Now we have couple of options to solve this situation. We can either explicitly add a condition to the ```requestHandler``` method to serve each file we have there. But that's not really going to scale when we develop our application to have many pages and style files. So, instead what we can do, is to decide that we can serve everything inside the *public/* folder and call it a day.

Ok, so let's change the ```requestHandler``` so that we pass the url that the client asks to the ```writeResponse``` function and map the default '/' to the *index.html* file.

In ```requestHandler``` function add
```
let url = request.url;
if (request.url === '/') {
    url = '/index.html'
}
writeResponse(response, url);
```

And also need to modify the ```writeResponse``` function so that we take the ```url``` as a parameter to the function and use it to decide which file we should read and write to the response like:

```
 fs.readFile('public' + url, function(err, html)...
 ```

 However, now the problem is that we still have the header that describes what type of file we're sending telling that we're sending html text. This is not true anymore, since we have CSS and JavaScript which we could serve also. So we need to decide what to write to the header based on the file ending.

We'll create a new function to decide what to write to the headers. In ```writeResponse``` function we'll call our new function ```writeResponseHeader``` instead of writing the "OK" and "Content-Type" headers.

 ```
/*
 * Write response header based on what kind of file type we're
 * serving.
 */
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
 ```

 So now the ```writeResponse``` function looks something like this:

```
 const writeResponse = function(response, url) {

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
```

So now, if you refresh the page in browser, you should see some style changes on the page. This happens cause we're now sending the 'styles.css' file to the browser.

## Task-4
Last thing we want to do is to add some interactiveness to our page. We have a small script file *script.js* also in the public folder, this script adds a like button to our news sections.

Now that we have done the hard work in the last section to enable serving everything in the */public* forlder, we can just enjoy the fruits of our labor. Uncomment the
```<script src="script.js" type="application/javascript" ></script>``` in *index.html* file to include the script to the page. You should now be able to like the news posts!


const http = require('http')

var server = http.createServer(function(request, response) {

    if (request.method == 'POST') {

            var body = '';

            request.on('data', function (data) {
                body += data;
            });

            request.on('end', function () {
                try {
                    var post = JSON.parse(body);
                    console.log(post)
                    return;
                }catch (err){
                    // Handle exception
                    return;
                }
            });
            
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write('Received!');
            response.end();
        }
    });

    server.listen(3000);
    console.log("Server started")
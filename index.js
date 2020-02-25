const express = require('express'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Blocks HTML characters (security equivalent to htmlentities in PHP)
    fs = require('fs');

const app = express();

// Loading the page index.html
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});
  
io.sockets.on('connection', function (socket, username) {
    // When the username is received it’s stored as a session variable and informs the other people
    socket.on('new_client', function(username){
        username = ent.encode(username);
        socket.username = username;
        socket.broadcast.emit('new_client', username);
    });
  
    // When a message is received, the client’s username is retrieved and sent to the other people
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {username: socket.username, message: message});
    }); 
});


const port = process.env.PORT || 3000;

app.listen(port, () =>
{
    console.log('Server Running On Port '+port);
})
const express = require('express'),
    ent = require('ent'), // Blocks HTML characters (security equivalent to htmlentities in PHP)
    fs = require('fs');

const translate = require('@k3rn31p4nic/google-translate-api');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

// Loading the page index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
  
io.sockets.on('connection', function (socket, username)
{
    // When the username is received it’s stored as a session variable and informs the other people
    socket.on('new_client', function(username){
        username = ent.encode(username);
        socket.username = username;
        socket.broadcast.emit('new_client', username);
    });
    
    // When the language and message value is received
    socket.on('language', function(languageWanted){

        socket.once('messageToBeTranformed', function(messageValue){
        
            console.log("Hello msg: "+messageValue);
            
            translate(messageValue, { to: languageWanted }).then(res =>
                {
                    console.log(res.text);

                    const transformedLanguage = res.text;
                    socket.emit('transformedLanguage', transformedLanguage);
                }).catch(err => {
                    console.log(err);
                });
        });
    });


    //Translator Setup
    /* 
    translate('Ik spreek Engels', {to: 'en'}).then(res => {
        console.log(res.text);
        //=> I speak English
        console.log(res.from.language.iso);
        //=> nl
    }).catch(err => {
        console.error(err);
    });
    */
  

    // When a message is received, the client’s username is retrieved and sent to the other people
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {username: socket.username, message: message});
    }); 
});



const port = process.env.PORT || 8080;

server.listen(port, () =>
{
    console.log('Server Running On Port '+port);
})
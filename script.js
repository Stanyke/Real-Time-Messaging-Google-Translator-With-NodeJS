// Connecting to socket.io
const socket = io.connect('http://localhost:8080');

// The username is requested, sent to the server and displayed in the title
const username = prompt('What\'s your username?');

if(username === '')// Checks if username is empty
{
    alert('Username Empty, Try Again...');
    location.reload(); // Reload current page
}
// If username is not empty
else
{
    socket.emit('new_client', username); // Passes username as new_client
    document.title = username + ' - ' + document.title; // Updates webpage's title adding username to it

    
    // When a message is received it's inserted in the page
    socket.on('message', (data) => 
    {
        insertMessage(data.username, data.message)
    });

    
    // When a new client connects, the information is displayed
    socket.on('new_client', (username) =>
    {
        $('#chat_zone').prepend('<p><em>' + username + ' has joined the chat!</em></p>');
    })

    
    // When translator is clicked
    translateLanguage = () =>
    {
        const messageValue = $('#message').val(); // Gets message value
        const languageWanted = $('#language').val(); // Gets language code's value
        socket.emit('language', languageWanted); // Sends language code
        socket.emit('messageToBeTranformed', messageValue); // Sends the message
    }


    $('#chat_form').submit( () =>
    {
        var message = $('#message').val();
        socket.emit('message', message); // Sends the message to the others
        insertMessage(username, message); // Also displays the message on our page
        $('#message').val('').focus(); // Empties the chat form and puts the focus back on it
        return false; // Blocks 'classic' sending of the form
    });
                
    
    // Adds a message to the page
    insertMessage = (username, message) =>
    {
        $('#chat_zone').prepend('<p><strong>' + username + '</strong> ' + message + '</p>');
    }

    
    // Gets The Transformed language gotten from the index.js file
    socket.on('transformedLanguage', (transformedLanguage) =>
    {
        $('#message').val(transformedLanguage); // Replace current message value with the transformed language
    });
}
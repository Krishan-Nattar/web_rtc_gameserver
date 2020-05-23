let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let cors = require('cors');
let PORT = process.env.PORT || 8080;
console.log('server started on port ' + PORT);

app.use(express.static(__dirname + '/public'));

//This runs when a connection is made
io.on('connection', function(socket) {
    
    //joined room
    socket.on('ready', function(data) {
        socket.join(data.chat_room)
        socket.join(data.signaling_room)
        socket.broadcast.to(data.signaling_room).emit('announce', {message: `${data.my_name} has joined the channel`})
    })
    
    //chat
    socket.on('send',function(data) {
        socket.broadcast.to(data.room).emit('message', {message: data.message, author: data.author})
    })
    
    // //signaling
    socket.on('signal', function(data) {
        console.log('this is signal');
        socket.broadcast.to(data.room).emit('signaling_message', {message: data.message, type: data.type})
    })

})


server.listen(PORT);
//index page

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//app.get('/chat')

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("chat_message", (msg) => {
        io.emit("chat_message", msg);
    });

    socket.broadcast.emit("chat_message", "User has joined the chat");

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(8080, () => {
    console.log('listening on port');
});
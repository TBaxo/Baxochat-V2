//index page
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const connected_users = {};


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
    var endpoint = `/chat?username=${req.body.username}`
    res.redirect(endpoint);
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});


io.on('connection', (socket) => {
    let username = socket.handshake.query.username;
    console.log(`${username} has connected`);

    if (!connected_users[socket.id]) {

        socket.on("chat_message", (msg) => {

            socket.broadcast.emit("chat_message", msg);
        });

        socket.broadcast.emit("user_join", `${username} has joined the chat`);

        socket.on('disconnect', () => {
            console.log('user disconnected');

            delete connected_users[socket.id];
        });

        connected_users[socket.id] = username;
    }
});

http.listen(8080, () => {
    console.log('listening on port');
});
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

        connected_users[socket.id] = username;

        let data = {
            username: username,
            text: `${username} has joined the chat`,
            connectedusers: Object.values(connected_users)
        };

        io.emit("user_join", data);

        socket.on("chat_message", (msg) => {
            socket.broadcast.emit("chat_message", msg);
        });

        socket.on('disconnect', () => {
            let disconnectedUsername = connected_users[socket.id];
            console.log(`${disconnectedUsername} has disconnected`);

            delete connected_users[socket.id];

            let data = {
                username: disconnectedUsername,
                text: `${disconnectedUsername} has left the chat`,
                connectedusers: Object.values(connected_users)
            };

            io.emit('user_leave', data);
        });
    }
});

http.listen(8080, () => {
    console.log('listening on port');
});
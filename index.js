//index page
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const connected_users = {};
const users_typing = {};


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
    let username = req.body.username;

    if (Object.values(connected_users).includes(username)) {
        res.sendFile(__dirname + '/index.html');
    }

    let endpoint = `/chat?username=${username}`;
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
            if (msg.text.length >= 200) return null;
            socket.broadcast.emit("chat_message", msg);
        });

        socket.on('disconnect', () => {
            let disconnectedUsername = connected_users[socket.id];
            console.log(`${disconnectedUsername} has disconnected`);

            delete connected_users[socket.id];
            delete users_typing[socket.id];

            let data = {
                username: disconnectedUsername,
                text: `${disconnectedUsername} has left the chat`,
                connectedusers: Object.values(connected_users)
            };

            io.emit('user_leave', data);
        });

        socket.on('user_typing', (username) => {
            if (users_typing[socket.id] != null) {
                clearTimeout(users_typing[socket.id].timeout);
                users_typing[socket.id].timeout = usersTypingTimeout(socket.id, username);
                return;
            }

            console.log(`${username} is typing`);

            let data = {
                username: username,
                timeout: usersTypingTimeout(socket.id, username)
            };

            users_typing[socket.id] = data;

            let usernames = Object.keys(users_typing).map((key) => {
                return users_typing[key].username;
            });

            io.emit('users_typing', usernames);
        });
    }
});

let usersTypingTimeout = (socketId, username) => {
    return setTimeout(() => {
        console.log(`${username} is no longer typing`);
        delete users_typing[socketId];

        let usernames = Object.keys(users_typing).map((key) => {
            return users_typing[key].username;
        });

        io.emit('users_typing', usernames);
    }, 5000);
}
http.listen(8080, () => {
    console.log('listening on port');
});
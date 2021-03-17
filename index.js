//index page
const express = require('express');
const bodyparser = require('body-parser');
const { ServerState } = require("./state/ServerState")
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const state = new ServerState(io);


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
    let username = req.body.username;
    let userState = state.GetUserState();

    let result = userState.GetUserExistsByUsername(username);

    if (userState.GetUserExistsByUsername(username)) {
        res.sendFile(__dirname + '/index.html');
        return;
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

    let userState = state.GetUserState();

    if (!userState.GetUserExistsByUsername(username)) {

        let newUser = userState.CreateUser(username, socket);

        let data = {
            username: newUser.username,
            text: `${newUser.username} has joined the chat`,
            connectedusers: userState.GetAllUsernames()
        };

        io.emit("user_join", data);

        socket.on("chat_message", (msg) => {
            if (msg.text.length >= 200) return null;

            socket.broadcast.emit("chat_message", msg);
            io.emit("users_finished_typing", msg.username);
        });

        socket.on('disconnect', () => {
            let userState = state.GetUserState();

            let disconnectedUser = userState.GetUser(socket.id);
            console.log(`${disconnectedUser.username} has disconnected`);

            userState.RemoveUserBySocketId(socket.id);

            let data = {
                username: disconnectedUser.username,
                text: `${disconnectedUser.username} has left the chat`,
                connectedusers: userState.GetAllUsernames()
            };

            io.emit('user_leave', data);
        });

        socket.on('user_typing', (username) => {

            let userState = state.GetUserState();

            let user = userState.GetUserByUserName(username);

            state.SetIsUserTyping(user);

            console.log(`${username} is typing`);

            let users_typing = state.GetUsersTyping();

            let users_typing_usernames = users_typing.map(user => { return user.username });

            io.emit('users_typing', users_typing_usernames);
        });
    }
});


http.listen(8080, () => {
    console.log('listening on port');
});
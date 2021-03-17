//index page
const express = require('express');
const bodyparser = require('body-parser');
const { UserState } = require("./state/UserState");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const state = new UserState();


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
    let username = req.body.username;

    if (state.GetUserExists(username)) {
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

    if (state.GetUserExistsBySocketId(socket.id)) {

        let newUser = state.CreateUser(username, socket.id);

        let data = {
            username: user.username,
            text: `${user.username} has joined the chat`,
            connectedusers: state.GetAllUsernames()
        };

        io.emit("user_join", data);

        socket.on("chat_message", (msg) => {
            if (msg.text.length >= 200) return null;

            socket.broadcast.emit("chat_message", msg);
            io.emit("users_finished_typing", msg.username);
        });

        socket.on('disconnect', () => {
            let disconnectedUsername = state.GetUser(socket.id).username;
            console.log(`${disconnectedUsername} has disconnected`);


            let data = {
                username: disconnectedUsername,
                text: `${disconnectedUsername} has left the chat`,
                connectedusers: state.GetAllUsernames()
            };

            io.emit('user_leave', data);
        });

        socket.on('user_typing', (username) => {

            console.log(`${username} is typing`);

            io.emit('user_typing', username);
        });
    }
});


//IMPORTANT WORK HERE, REWRITING THE USERSTYPING FUNCTIONALITY NEED TO FINISH BEFORE NEXT BUILD
const UsersTyping = {
    ids: [],
    timeouts: [],
    set: (user) => {
        user.isTyping = true;
        ids.push(user.id);
        console.log(`${username} is typing`);

        let timeout = setTimeout(() => {
            console.log(`${user.username} is no longer typing`);
            delete this.ids[user.id];
            delete this.timeouts[]

            let usersTyping = state.GetUsersTyping();
        });

        io.emit('users_typing', usernames);
    };

    reset: (user) => {
        return "f";
    },
    cancel: (user) => {

    }
}



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
//index page
const express = require('express');
const bodyparser = require('body-parser');
const { ServerState } = require("./server/state/ServerState")
const { ServerClient } = require("./server/serverclient/ServerClient")
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http);
const state = new ServerState(io);

const client = new ServerClient(io, state);


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', async function (req, res) {
    let username = req.body.username;

    if (await client.CheckUserExists(username)) {
        res.sendFile(__dirname + '/index.html');
        return;
    }

    let endpoint = `/chat?username=${username}`;
    res.redirect(endpoint);
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});


http.listen(8080, () => {
    console.log('listening on port');
});
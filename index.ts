//index page
import Express, { Application } from 'express';
import bodyparser from 'body-parser';
import { ServerState } from "./server/state/ServerState";
import { ServerClient } from "./server/serverclient/ServerClient";
import { Server, Socket } from 'socket.io';
import { Server as HttpServer, createServer } from 'http'

//Setting up application
const app: Application = Express();
const http: HttpServer = createServer(app);
const io: Server = new Server(http);
const client: ServerClient = new ServerClient(io);

//Setup express constants
app.use(Express.static(__dirname + '/public'));
app.use(Express.static(__dirname + '/dist'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', async function (req, res) {
    let username: string = req.body.username;

    if (!await client.CheckUserExists(username)) {
        res.sendFile(__dirname + '/index.html');
        return;
    }

    let endpoint = `/chat?username=${username}`;
    res.redirect(endpoint);
});

// Redirect to react app 
// TODO> need to add some security on this routing
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

//Start HttpServer
http.listen(8080, () => {
    console.log('listening on port');
});
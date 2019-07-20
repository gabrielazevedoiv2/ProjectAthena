const express = require('express');
const path = require('path');
const RPSServerController = require('./RPSGame/rpsServerController');
const PongServerController = require('./PongGame/pongServerController');
const AthenaServer = require('./athena/Athena');

// Express app logic
const app = express();
app.use("/rps", express.static(__dirname + '/RPSGame'));
app.use("/pong", express.static(__dirname + '/PongGame'));
app.use("/dsrpg", express.static(__dirname + '/DeadSimpleRPG'));
app.use("/", express.static(path.join(__dirname, '/public/Index')));
app.use("/csslib", express.static(path.join(__dirname, '/public/CSSLib')));

app.get('/', (req, res) => {
    res.sendfile('index.html');
});

app.get('/rps', (req, res) => {
    res.sendFile('index.html');
});

const server = app.listen(3010, () => {
    console.log('Project Athena listening on port 3000');
});

//Socket IO Server Logic
const io = require('socket.io').listen(server);

const RPSServer = new RPSServerController(io); // new instance of RPS game
const PongServer = new PongServerController(io);
const athenaServers = [];

io.on('connection', (client) => {
    console.log(client.id + ' connected');
    client.send(client.id);
    client.on("athenaConnected", (e) => {
        athenaServers.push(new AthenaServer(io, client, e));
    });
    client.on("athenaDisconnected", (e) => {

    })
    // When player connects, assign it's id to the game it requested.
    client.on('playerConnected', (e) => {
        switch (e.game) {
            case 'rps':
                RPSServer.pushPlayer(client);
                break;
            case 'pong':
                PongServer.pushPlayer(client);
        }
    });
});


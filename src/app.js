const express = require('express');
const path = require('path');
const RPSServerController = require('./RPSGame/rpsServerController');

// Express app logic
const app = express();
app.use("/rps", express.static(__dirname + '/RPSGame'));
app.use("/", express.static(path.join(__dirname, '/public/Index')));
app.use("/csslib", express.static(path.join(__dirname, '/public/CSSLib')));

app.get('/', (req, res) => {
    res.sendfile('index.html');
});

app.get('/rps', (req, res) => {
    res.sendFile('index.html');
});

const server = app.listen(3000, () => {
    console.log('Project Athena listening on port 3000');
});

//Socket IO Server Logic
const io = require('socket.io').listen(server);

const RPSServer = new RPSServerController(io); // new instance of RPS game

io.on('connection', (client) => {
    console.log(client.id + ' connected');
    client.send(client.id);
    // When player connects, assign it's id to the game it requested.
    client.on('playerConnected', (e) => {
        switch (e.game) {
            case 'rps':
                RPSServer.pushPlayer(client);
                break;
        }
    });
});


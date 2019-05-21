const express = require('express');
const RPSServerController = require('./RPSGame/rpsServerController');

// Express app logic
const app = express();

app.use(express.static(__dirname + '/RPSGame'));

app.get('/', (req, res) => {
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


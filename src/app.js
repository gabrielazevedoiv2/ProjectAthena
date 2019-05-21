const express = require('express');
const RPSServerController = require('./RPSGame/rpsServerController');

const app = express();

app.use(express.static(__dirname + '/RPSGame'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

const server = app.listen(3000, () => {
    console.log('Project Athena listening on port 3000');
});

const io = require('socket.io').listen(server);

const RPSServer = new RPSServerController(io);

io.on('connection', (client) => {
    console.log(client.id + ' connected');
    client.send(client.id);
    // client.on('disconnect', (e) => {
        
    //     console.log(client.id + ' disconnected');
    // });
    client.on('playerConnected', (e) => {
        switch (e.game) {
            case 'rps':
                RPSServer.pushPlayer(client);
                break;
        }
    });
});


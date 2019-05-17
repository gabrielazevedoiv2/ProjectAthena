import express = require('express');
import path = require('path');

const app: express.Application = express();

app.get('/', (req, res) => {
    res.sendFile('index.html', {'root': './'});
});

const server = app.listen(3000, () => {
    console.log('Project Athena listening on port 3000');
});

const io = require('socket.io').listen(server);

io.on('connection', (socket: any) => {
    console.log(socket);
    console.log('User Connected');
});


const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.sendFile('index.html', {'root': './'});
});

const server = app.listen(3000, () => {
    console.log('Project Athena listening on port 3000');
});

const io = require('socket.io').listen(server);

io.on('connection', (socket) => {
    console.log(socket);
    console.log('User Connected');
});


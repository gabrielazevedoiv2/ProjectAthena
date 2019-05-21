var socket;
window.onload = (e) => {
    socket = io.connect('http://localhost:3000');
    socket.emit('playerConnected', {"game": "rps"});
}

class GameController {
    constructor(id) {
        this.id = id;
        this.socket = socket;
    };
}
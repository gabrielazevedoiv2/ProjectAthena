window.onload = (window) => {
    // Socket
    socket = io.connect('http://projectathena.tech:3000');
    // socket = io.connect('http://localhost:3000');    
    socket.emit('playerConnected', {"game": "pong"});
    socket.on('receivedConnection', (e) => {
        posx = 0;
        posy = 0;
        const gameController = new PongController(socket, document.getElementById('pong'));
    });
    // Controller
}   

class PongController {
    constructor(socket, canvas, playerData) {
        this.socket = socket;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.player;
        this.enemy;
        this.init();
    }

    init() {
        this.context.strokeStyle = "#000";
        this.context.strokeRect(0, 0, this.canvas.)
    }

    findMatch() {
        this.socket.emit('findMatch', {playerId: this.player.playerId});
        this.socket.on('matchFound', (e) => {
            this.matchStart(e);
        });
    }

    matchStart(e) {
        this.context.fillStyle = 'blue';
        this.context.fillRect(this.player.pos.x, this.player.pos.y, 20, 100);
        this.context.fillStyle = 'red';
        this.context.fillRect(this.enemy.pos.x, this.enemy.pos.y, 20, 100);
    }

    moveUp(e) {
        this.player.moveUp(e);
    }

    moveDown(e) {
        this.player.moveDown(e);
    }
}

class Player {
    constructor(playerId, posx, posy) {
        this.playerId = playerId;
        this.pos = {
            x: posx,
            y: posy
        }
    }

    moveUp(e) {

    }

    moveDown(e) {

    }
}
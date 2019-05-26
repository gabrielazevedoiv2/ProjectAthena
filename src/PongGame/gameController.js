window.onload = (window) => {
    // Socket
    // socket = io.connect('http://projectathena.tech:3000');
    socket = io.connect('http://localhost:3000');    
    socket.emit('playerConnected', {"game": "pong"});
    socket.on('receivedConnection', (e) => {
        const gameController = new PongController(socket, document.getElementById('pong'));
    });
    // Controller    
    const gameController = new PongController(socket, document.getElementById('pong'));
}   

class PongController {
    constructor(socket, canvas, playerData) {
        this.socket = socket;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.player;
        this.enemy;
        this.init();
        this.defineEvents();
    }

    init() {
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0, this.canvas.width, 2);
        this.context.fillRect(0, this.canvas.height-2, this.canvas.width, 2);
        this.context.beginPath();
        this.context.strokeStyle = "#000";
        this.context.setLineDash([5, 5]);
        this.context.moveTo(this.canvas.width/2, this.canvas.height - 3);
        this.context.lineTo(this.canvas.width/2, 0);
        this.context.stroke();
    }

    defineEvents() {
        this.socket.on('enemyMoved', (e) => {
            this.context.clearRect(this.enemy.pos.x, this.enemy.pos.y, 2, 10);
            this.context.fillStyle = 'red';
            this.context.fillRect(e.pos.x, e.pos.y, 2, 10);
            this.enemy.pos = {...e};
        });
        this.socket.on('playerMoved', (e) => {
            this.context.clearRect(this.player.pos.x, this.player.pos.y, 2, 10);
            this.context.fillStyle = 'red';
            this.context.fillRect(e.pos.x, e.pos.y, 2, 10);
            this.player.pos = {...e};
        });
        window.onkeydown = (e) => {
            if (e.keyCode == 38) this.moveUp();
            if (e.keyCode == 40) this.moveDown();
        }
    }

    findMatch() {
        this.socket.emit('findMatch', {playerId: this.player.playerId});
        this.socket.on('matchStarted', (e) => {
            this.matchStart(e);
        });
    }

    matchStart(e) {
        this.context.fillStyle = 'blue';
        this.context.fillRect(this.player.pos.x, this.player.pos.y, 2, 10);
        this.context.fillStyle = 'red';
        this.context.fillRect(this.enemy.pos.x, this.enemy.pos.y, 2, 10);
    }

    moveUp(e) {
        console.log('up');
        this.socket.emit('moveUp', {direction: 'up'});
    }

    moveDown(e) {
        console.log('down');
        this.socket.emit('moveDown', {direction: 'down'});
    }
}
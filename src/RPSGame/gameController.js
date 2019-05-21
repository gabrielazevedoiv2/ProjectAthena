var socket;
let playerId;
window.onload = (window) => {
    socket = io.connect('http://localhost:3000');
    socket.emit('playerConnected', {"game": "rps"});
    socket.on('matchStarted', (e) => {
        console.log(e)
        playerId = e.playerId;
    });
    document.querySelectorAll('#rock, #scissors, #paper').forEach((x) => {
        x.onclick = (e) => {
            document.querySelector('#mychoice').innerHTML = 'My Choice: ' + e.currentTarget.value;
            socket.emit('playerChoice', {value: e.currentTarget.value});
        }
    })
    socket.on('matchResult', (e) => {
        if (e.result.winner.id == playerId) {            
            document.querySelector('#theirchoice').innerHTML = 'Their choice: ' + e.result.loser.choice;
            alert('you win!');
        } else {
            document.querySelector('#theirchoice').innerHTML = 'Their choice: ' + e.result.winner.choice;
            alert('you lose :(');
        }        
        console.log(e);
    })
}

class GameController {
    constructor(id) {
        this.id = id;
        this.socket = socket;
    };
}
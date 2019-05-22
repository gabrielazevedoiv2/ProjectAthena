var socket;
let playerId;
window.onload = (window) => {
    // Socket
    socket = io.connect('http://projectathena.tech:3000');
    socket.emit('playerConnected', {"game": "rps"});
    socket.on('matchStarted', (e) => {
        console.log(e)
        playerId = e.playerId;
        document.querySelector('#findMatch').style.display = 'none';
        document.querySelector('#matchOptions').style.display = 'block';
    });
    socket.on('matchResult', (e) => {
        if (e.result == 'draw') {
            document.querySelector('#theirchoice').innerHTML = 'Their choice: ' + document.querySelector('#mychoice').innerHTML.split(':')[1];
            alert('draw');
        } else if (e.result.winner.id == playerId) {            
            document.querySelector('#theirchoice').innerHTML = 'Their choice: ' + e.result.loser.choice;
            alert('you win!');
        } else {
            document.querySelector('#theirchoice').innerHTML = 'Their choice: ' + e.result.winner.choice;
            alert('you lose :(');
        }
        console.log(e);
    });
    socket.on('playersSearching', (e) => {
        console.log(e);
    });
    socket.on('canMatchAgain', (e) => {
        document.querySelector('#findMatch').style.display = 'block';
        document.querySelector('#matchOptions').style.display = 'none';
    })

    // DOM
    document.querySelectorAll('#rock, #scissors, #paper').forEach((x) => {
        x.onclick = (e) => {
            document.querySelector('#mychoice').innerHTML = 'My Choice: ' + e.currentTarget.value;
            socket.emit('playerChoice', {value: e.currentTarget.value});
        }
    })
    document.querySelector('#findMatchBtn').onclick = () => {
        socket.emit('findMatch');
    }
}

class GameController {
    constructor(id) {
        this.id = id;
        this.socket = socket;
    };
}
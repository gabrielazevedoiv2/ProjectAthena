// ====================================================================
// RPS Server Controller by Gabriel Azevedo
// ====================================================================
// To-do:
// 1. Implement socket.io rooms logic
// 2. Clean-up code

module.exports = class RPSServerController {
    constructor(socket) {
        this.socket = socket;
        this.players = [];
        this.currentMatches = [];
    }

    pushPlayer(client) {
        this.players.push({
            id: client.id,
            inMatch: false,
            searching: false,
            client: client
        });
        client.on('disconnect', (e) => {
            console.log(client.id + ' disconnected');
            this.popPlayer(client.id);
        });
        client.on('findMatch', (e) => {
            this.players.find((x) => x.id == client.id).searching = true;
            this.findMatch();
        });
    }

    popPlayer(id) {
        this.players = this.players.filter((x) => x.id != id);
    }

    findMatch() {
        this.socket.emit('playersSearching', {
            players: this.players.filter((x) => x.searching == true).length
        });
        var findInterval = setInterval(() => {
            var playersSearching = this.players.filter((x) => x.searching == true);
            if (this.players.filter((x) => x.searching == true).length > 1) {
                this.startMatch(playersSearching[0], playersSearching[1]);
                this.removeFromQueue([playersSearching[0].id, playersSearching[1].id]);
                clearInterval(findInterval);
            }
        }, 1000);
    }

    startMatch(player1, player2) {
        this.setInMatch([player1.id, player2.id]);
        const matchId = 'match_'+new Date().toLocaleString();
        this.currentMatches.push({
            matchId: matchId,
            players: [{
                id: player1.id,
                choice: ''
            },{
                id: player2.id,
                choice: ''
            }]
        });
        this.sendMatchStarted([player1.id, player2.id], matchId);
        this.awaitPlayerChoices([player1, player2], matchId);
    }

    getMatchResult(match) {
        if ((match.players[0].choice == 'rock' && match.players[1].choice == 'scissors') || 
            (match.players[0].choice == 'scissors' && match.players[1].choice == 'paper') ||
            (match.players[0].choice == 'paper' && match.players[1].choice == 'rock')) {
            return {
                winner: match.players[0],
                loser: match.players[1],
            }
        } else if ((match.players[1].choice == 'rock' && match.players[0].choice == 'scissors') || 
            (match.players[1].choice == 'scissors' && match.players[0].choice == 'paper') ||
            (match.players[1].choice == 'paper' && match.players[0].choice == 'rock')) {
            return {
                winner: match.players[1],
                loser: match.players[0]
            }   
        } else {
            return 'draw';            
        }
    }

    setInQueue(playersIds) {
        playersIds.forEach((x) => {
            this.players.find((y) => y.id == x).searching = true;
        });
    }

    setInMatch(playersIds) {
        playersIds.forEach((x) => {
            this.players.find((y) => y.id == x).inMatch = false;
        });
    }

    removeFromQueue(playersIds) {
        playersIds.forEach((x) => {
            this.players.find((y) => y.id == x).searching = false;
        });
    }

    removeFromMatch(playersIds) {
        playersIds.forEach((x) => {
            this.players.find((y) => y.id == x).inMatch = false;
            this.socket.to(x).emit('canMatchAgain');
        });
    }

    sendMatchStarted(playersIds, matchId) {
        playersIds.forEach((x) => {
            this.socket.to(x).emit('matchStarted', {
                playerId: x,
                matchId: matchId
            });
        });
    }

    awaitPlayerChoices(players, matchId) {
        players.forEach((x) => {
            x.client.once('playerChoice', (e) => {
                this.currentMatches.find((y) => y.matchId == matchId).players.find((y) => y.id == x.id).choice = e.value;
                const match = this.currentMatches.find(y => y.matchId == matchId);
                console.log(match);
                if (match.players[0].choice != '' && match.players[1].choice != '') {
                    const result = this.getMatchResult(match);
                    this.sendMatchResult([match.players[0].id, match.players[1].id], result);
                }
            });
        });
    }

    sendMatchResult(playerIds, result) {
        playerIds.forEach((x) => {
            this.socket.to(x).emit('matchResult', {
                result: result
            });
        });
        this.removeFromMatch(playerIds);
    }

}
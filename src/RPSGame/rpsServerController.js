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
            client: client
        });
        client.on('disconnect', (e) => {
            console.log(client.id + ' disconnected');
            this.popPlayer(client.id);
        });
        const unmatchedPlayers = this.players.filter((x) => x.inMatch == false);
        if (unmatchedPlayers.length > 1) {
            this.startMatch(unmatchedPlayers[0], unmatchedPlayers[1]);
        }
    }

    popPlayer(id) {
        this.players = this.players.filter((x) => x.id != id);
    }

    startMatch(player1, player2) {
        this.players.find((x) => x.id == player1.id).inMatch = true;
        this.players.find((x) => x.id == player2.id).inMatch = true;
        // Develop match logic
        const matchId = 'match_'+new Date().toLocaleString();
        this.currentMatches.push({
            matchId: matchId,
            player1: {
                id: player1.id,
                choice: ''
            },
            player2: {
                id: player2.id,
                choice: ''
            }
        });
        this.socket.to(player1.id).emit('matchStarted', {
            playerId: player1.id,
            matchId: matchId
        });
        this.socket.to(player2.id).emit('matchStarted', {
            playerId: player2.id,
            matchId: matchId
        });
        player1.client.once('playerChoice', (e) => {
            const match = this.currentMatches.find(x => x.matchId == matchId);
            match.player1.choice = e.value;
            if (match.player1.choice != '' && match.player2.choice != '') {
                const result = this.getMatchResult(match);
                if (result != 'draw') {
                    this.socket.to(player1.id).emit('matchResult', {
                        result: result
                    });
                    this.socket.to(player2.id).emit('matchResult', {
                        result: result
                    });
                }
            }
        });        
        player2.client.once('playerChoice', (e) => {
            const match = this.currentMatches.find(x => x.matchId == matchId);
            match.player2.choice = e.value;
            if (match.player1.choice != '' && match.player2.choice != '') {
                const result = this.getMatchResult(match);
                if (result != 'draw') {
                    this.socket.to(player1.id).emit('matchResult', {
                        result: result
                    });
                    this.socket.to(player2.id).emit('matchResult', {
                        result: result
                    });
                }
            }
        });
    }

    getMatchResult(match) {
        if ((match.player1.choice == 'rock' && match.player2.choice == 'scissors') || 
            (match.player1.choice == 'scissors' && match.player2.choice == 'paper') ||
            (match.player1.choice == 'paper' && match.player2.choice == 'rock')) {
            return {
                winner: match.player1,
                loser: match.player2,
            }
        } else if ((match.player2.choice == 'rock' && match.player1.choice == 'scissors') || 
            (match.player2.choice == 'scissors' && match.player1.choice == 'paper') ||
            (match.player2.choice == 'paper' && match.player1.choice == 'rock')) {
            return {
                winner: match.player2,
                loser: match.player1
            }   
        } else {
            return 'draw';
        }
    }
}
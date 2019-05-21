module.exports = class RPSServerController {
    constructor(io) {
        this.io = io;
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
    }

    popPlayer(id) {
        this.players = this.players.filter((x) => x.id != id);
    }

    startMatch(player1, player2) {
        // Develop match logic
        this.currentMatches.push({
            player1: {
                id: player1.id,
                choice: ''
            },
            player2: {
                id: player2.id,
                choice: ''
            }
        });
    }
}
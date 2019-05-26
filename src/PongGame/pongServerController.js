module.exports = class PongServerController {
    constructor(socket) {
        this.socket = socket;
        this.players = [];
        this.currentMatches = [];
        this.arenaProps = {
            ballSpeed: 0.1,
            constraints: {

            }
        }
    }

    pushPlayer(client) {
        this.players.push({
            id: client.id,
            inMatch: false,
            searching: false,
            matchProperties: {
                x: 0,
                y: 0.5,
                speed: 0.05
            },
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
            },{
                id: player2.id,
            }]
        });
        this.sendMatchStarted([player1.id, player2.id], matchId);
    }

    setInMatch(playersIds) {
        playersIds.forEach((x) => {
            this.players.find((y) => y.id == x).inMatch = false;
        });
    }

    sendMatchStarted(playersIds, matchId) {
        playersIds.forEach((x) => {
            this.socket.to(x).emit('matchStarted', {
                playerId: x,
                matchId: matchId
            });
        });
        this.defineCommands(playersIds);
    }

    defineCommands() {
        this.players.forEach((x) => {
            x.client.on('moveUp', (e) => {
                this.players.find((y) => {
                    if (y.matchProperties.y + y.matchProperties.speed > 1) {
                        return;
                    } else {
                        y.matchProperties.y += y.matchProperties.speed;
                    }
                })
            });
            x.client.on('moveDown', (e) => {
                this.players.find((y) => {
                    if (y.matchProperties.y - y.matchProperties.speed < 0) {
                        return;
                    } else {
                        y.matchProperties.y -= y.matchProperties.speed;
                        this.socket.to(x.client).emit('movedDown', )
                    }
                })
            });
        });
    }
}
const SSHClient = require('ssh2').Client;

module.exports = class AthenaServer {
    constructor(io, client, config) {
        this.socket = io;
        this.client = client;
        this.config = config;
        this.init();
    }

    init() {
        this.connection = new SSHClient();
        this.connection.on('ready', () => {
            this.socket.to(this.client.id).emit('data', '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');
            this.connection.shell((err, stream) => {
                if (err) {
                    return this.socket.to(this.client.id).emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
                }
                this.socket.on('data', (data) => {
                    stream.write(data);
                });
                stream.on('data', (data) => {
                    this.socket.to(this.client.id).emit('data', data.toString('binary'))
                }).on('close', () => {
                    this.connection.end();
                })
            });
        }).on('close', () => {
            this.socket.to(this.client.id).emit('data', '\r\n*** SSH CONNECTION CLOSED ***\r\n');
        }).on('error', (err) => {
            socket.emit('data', '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
        }).connect(this.config);
    }
}
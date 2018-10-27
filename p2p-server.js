const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 8086;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
//HTTP_PORT=8087 P2P_PORT=8088 PEERS=ws://localhost:8085 npm run dev
class P2pServer {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen() {
        const server = new Websocket.Server({
            port: P2P_PORT
        });
        server.on('connection', (socket) => {
            this.connectSocket(socket);
        });

        this.connectToPeers();

        console.log(`listening for p2p connection on ${P2P_PORT}`);
    }
    connectToPeers() {
        peers.forEach(peer => {
            const socket = new Websocket(peer);
            socket.on('open', () => {
                this.connectSocket(socket);
            });
        });
    }
    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('socket connected');
    }
}

module.exports = P2pServer;
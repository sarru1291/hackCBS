const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2pServer = require('../p2p-server');
const Wallet = require('../locker');
const multer = require('multer');
const Miner = require('./miner');
const url = require('url');
const formidable = require('formidable');
const TransactionPool = require('../locker/transaction-pool');
const HTTP_PORT = process.env.HTTP_PORT || 8085;
// HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
var app = express();
app.set('view engine', 'ejs');
const wallet = new Wallet();
const tp = new TransactionPool();
const bc = new Blockchain();
const path = require('path');
const p2pServer = new P2pServer(bc, tp);
// const miner = new Miner(bc, tp, wallet, p2pServer);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.render('main');
});
app.get('/blocks', (req, res) => {
    res.json(bc.chain);
    res.end();
});
app.post('/userProfile', function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received upload:\n\n');
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });

});
app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added ${block.toString()}`);
    p2pServer.syncChains();
    res.redirect('/blocks');
    res.end();
});

app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
});
app.post('/transact', (req, res) => {
    const {
        recipient,
        amount
    } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});


app.get('/public-key', (req, res) => {
    res.json({
        publicKey: wallet.publicKey
    });
});
app.listen(HTTP_PORT, () => {
    console.log(`server is running at port ${HTTP_PORT}`);
});

p2pServer.listen();
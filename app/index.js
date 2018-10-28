const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2pServer = require('../p2p-server');
const Wallet = require('../wallet');
const Miner = require('./miner');
const TransactionPool = require('../wallet/transaction-pool');
const HTTP_PORT = process.env.HTTP_PORT || 8085;
var app = express();
const wallet = new Wallet();
const tp = new TransactionPool();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);
app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain);
    res.end();
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
app.get('/mine-transactions', (req, res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/blocks');
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
const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2pServer = require('../p2p-server');

const HTTP_PORT = process.env.HTTP_PORT || 8085;
var app = express();

app.use(bodyParser.json());

const bc = new Blockchain();
const p2pServer = new P2pServer(bc);

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
app.listen(HTTP_PORT, () => {
    console.log(`server is running at port ${HTTP_PORT}`);
});

p2pServer.listen();
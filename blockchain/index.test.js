const Blockchain = require('./index');
const expect = require('chai').expect;
const Block = require('./block');

describe('Blockchain', () => {
    let bc, bc2;
    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });
    it('start with genesis block', () => {
        expect(bc.chain[0].toString()).equals(Block.genesis().toString());
    });
    it('add a new block', () => {
        let data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length - 1].data).equals('foo');
    });
    it('validate a valid chain', () => {
        bc2.addBlock('foo');
        bc.isValidChain(bc2.chain);
        expect(bc.isValidChain(bc2.chain)).which.is.true;
    });
    it('replace the chain with a new valid chain', () => {
        let data = 'goo';
        bc2.addBlock(data);
        bc.replaceChain(bc2.chain);
        expect(bc.chain).equals(bc2.chain);
    });
    it('not replace the chain with a new valid chain when new chain has less length', () => {
        let data = 'goo';
        bc.addBlock(data);
        bc.replaceChain(bc2.chain);
        expect(bc.chain).is.not.equals(bc2.chain);
    });
});
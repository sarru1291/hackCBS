const Block = require('./block'),
    Blockchain = require('./index');
const expect = require('chai').expect;

describe('Block', () => {
    let data, lastBlock, block;

    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('sets the `data` to match the input', () => {
        expect(block.data).equals(data);
    });

    it('sets the `lastHash` to match the hash of last block', () => {
        expect(block.lastHash).equals(lastBlock.hash);
    });
    it('check the block hash', () => {

    });
});
const Block = require('./block');
const Blockchain = require('./blockchain');

const fooBlock = Block.mineBlock(Block.genesis(), 'foo');
console.log(Block.blockHash(fooBlock));
console.log(Block.hash(fooBlock.timestamp));
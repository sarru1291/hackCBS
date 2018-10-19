const Block = require('./blockchain/block');
const Blockchain = require('./blockchain/index');

const fooBlock = Block.mineBlock(Block.genesis(), 'foo');
console.log(Block.blockHash(fooBlock));
console.log(Block.hash(fooBlock.timestamp));
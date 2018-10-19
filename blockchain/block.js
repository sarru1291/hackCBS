const crypto = require('crypto');

class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    toString() {
        return `Block-
        Timestamp: ${this.timestamp}
        Last Hash: ${this.lastHash.substring(0,10)}
        Hash     : ${this.hash.substring(0,10)}
        data     : ${this.data}`
    }
    static genesis() {
        return new this('Genesis time', '-----', 'fir57-h45h', []);
    }
    static mineBlock(lastBlock, data) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp, lastHash, data);

        return new this(timestamp, lastHash, hash, data);
    }
    static hash(timestamp, lastHash, data) {
        let password = `${timestamp}${lastHash}${data}`;
        let salt = crypto.randomBytes(16).toString('hex');
        return crypto.pbkdf2Sync(password, salt, 1000, 5, `sha512`).toString('hex');

    }
    static blockHash(block) {
        let {
            timestamp,
            lastHash,
            data
        } = block;
        return Block.hash(timestamp, lastHash, data);
    }
}

module.exports = Block;
const Head = require('../Head');

class HeadBundler {}

HeadBundler.extendHead = () => Head.rewind();

module.exports = { HeadBundler };

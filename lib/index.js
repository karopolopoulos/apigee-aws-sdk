var Lambda = require('./modules/lambda');
var STS = require('./modules/sts');
var Kinesis = require('./modules/kinesis');

module.exports = { Lambda: Lambda, STS: STS, Kinesis: Kinesis };

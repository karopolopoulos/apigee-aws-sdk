function Core(options) {
  if (!options || !options.accessKeyId || !options.secretAccessKey) {
    throw Error('Required options not included');
  }

  this.accessKeyId = options.accessKeyId;
  this.secretAccessKey = options.secretAccessKey;
  this.sessionToken = options.sessionToken;
  this.region = options.region || 'us-east-1';
}

module.exports = Core;

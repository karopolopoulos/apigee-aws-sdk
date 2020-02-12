function Core(options) {
  this.accessKeyId = options.accessKeyId;
  this.secretAccessKey = options.secretAccessKey;
  this.sessionToken = options.sessionToken;
  this.region = options.region;
}

module.exports = Core;

var generateAwsSignature = require('../common/utilities');

function Lambda(options) {
  this.accessKeyId = options.accessKeyId;
  this.secretAccessKey = options.secretAccessKey;
  this.region = options.region;
}

Lambda.prototype.invoke = function(params) {
  var protocol = 'https://';
  var method = 'POST';
  var host = 'lambda.' + this.region + '.amazonaws.com';
  var path = '/2015-03-31/functions/' + params.functionName + '/invocations';

  var datetime = new Date();
  datetime = datetime.toISOString().replace(/[-:]|\.\d{3}/g, '');

  var authorizationHeader = generateAwsSignature(
    host,
    path,
    params.payload,
    datetime,
    this.accessKeyId,
    this.secretAccessKey,
    this.region
  );

  var headers = {
    Authorization: authorizationHeader,
    'Content-Type': 'application/json',
    Host: host,
    'X-Amz-Date': datetime,
    'X-Amz-Invocation-Type': 'RequestResponse'
  };

  // eslint-disable-next-line no-undef
  var request = new Request(protocol + host + path, method, headers, payload);
  // eslint-disable-next-line no-undef
  var exchange = httpClient.send(request);
  exchange.waitForComplete();

  var responseObj;
  if (exchange.isSuccess()) {
    responseObj = exchange.getResponse().content.asJSON;
    if (responseObj.error) {
      throw new Error(responseObj.error_description);
    }
  }
  if (exchange.isError()) {
    throw new Error(exchange.getError());
  }

  return responseObj;
};

module.exports = { Lambda };

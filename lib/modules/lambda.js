var signRequest = require('../helpers/signRequest');

function Lambda(options) {
  this.accessKeyId = options.accessKeyId;
  this.secretAccessKey = options.secretAccessKey;
  this.region = options.region;
}

Lambda.prototype.invoke = function(params, callback) {
  var protocol = 'https://';
  var method = 'POST';
  var host = 'lambda.' + this.region + '.amazonaws.com';
  var path = '/2015-03-31/functions/' + params.FunctionName + '/invocations';

  var datetime = new Date();
  datetime = datetime.toISOString().replace(/[-:]|\.\d{3}/g, '');

  var headers = {
    'Content-Type': 'application/json',
    Host: host,
    'X-Amz-Date': datetime,
    'X-Amz-Invocation-Type': 'RequestResponse'
  };

  var signedRequest = signRequest({
    method: method,
    host: host,
    path: path,
    region: this.region,
    headers: headers,
    payload: params.Payload,
    datetime: datetime,
    accessKey: this.accessKeyId,
    secretKey: this.secretAccessKey
  });

  headers.Authorization = signedRequest;

  // eslint-disable-next-line no-undef
  var http = new XMLHttpRequest();
  http.open(method, protocol + host + path, false);
  Object.keys(headers).forEach(function(header) {
    http.setRequestHeader(header, headers[header]);
  });

  try {
    http.send(params.Payload);
  } catch (error) {
    return callback(error, null);
  }

  return callback(null, {
    StatusCode: http.status,
    ExecutedVersion:
      http.getResponseHeader('X-Amz-Executed-Version') || undefined,
    FunctionError: http.getResponseHeader('X-Amz-Function-Error') || undefined,
    LogResult: http.getResponseHeader('X-Amz-Log-Result') || undefined,
    Payload: http.response
  });
};

module.exports = Lambda;

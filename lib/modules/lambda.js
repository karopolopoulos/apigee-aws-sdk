var signRequest = require('../helpers/signRequest');
var http = require('../helpers/http');

function Lambda(options) {
  this.accessKeyId = options.accessKeyId;
  this.secretAccessKey = options.secretAccessKey;
  this.region = options.region;
}

Lambda.prototype.invoke = function(params, callback) {
  if (!params || !params.FunctionName) {
    throw Error('FunctionName is a required paramter');
  }

  var invocationType = params.InvocationType || 'RequestResponse';
  var queryString;
  if (params.Qualifier) {
    queryString = '?Qualifier=' + params.Qualifier;
  }

  var protocol = 'https://';
  var method = 'POST';
  var host = 'lambda.' + this.region + '.amazonaws.com';
  var path =
    '/2015-03-31/functions/' +
    params.FunctionName +
    '/invocations' +
    queryString;

  var datetime = new Date();
  datetime = datetime.toISOString().replace(/[-:]|\.\d{3}/g, '');

  var headers = {
    'Content-Type': 'application/json',
    Host: host,
    'X-Amz-Date': datetime,
    'X-Amz-Invocation-Type': invocationType
  };

  if (params.LogType) {
    headers['X-Amz-Log-Type'] = params.LogType;
  }
  if (params.ClientContext) {
    headers['X-Amz-Client-Context'] = params.ClientContext;
  }

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

  try {
    var response = http({
      method: method,
      url: protocol + host + path,
      headers: headers,
      body: params.Payload
    });

    return callback(null, {
      StatusCode: response.statusCode,
      ExecutedVersion: response.headers['X-Amz-Executed-Version'],
      FunctionError: response.headers['X-Amz-Function-Error'],
      LogResult: response.headers['X-Amz-Log-Result'],
      Payload: response.body
    });
  } catch (error) {
    return callback(error, null);
  }
};

module.exports = Lambda;

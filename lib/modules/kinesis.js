var Core = require('./core');
var signRequest = require('../helpers/signRequest');
var http = require('../helpers/http');

function Kinesis(options) {
  Core.call(this, options);
}

Kinesis.prototype.putRecords = function (params, callback) {
  if (!params || !params.Records || !params.StreamName) {
    throw Error('Required parameters not included');
  }

  try {
    var protocol = 'https://';
    var method = 'POST';
    var host = 'kinesis.' + this.region + '.amazonaws.com';
    var path = '';
    var queryString = '';
    var payload = JSON.stringify(params);

    var datetime = new Date();
    datetime = datetime.toISOString().replace(/[-:]|\.\d{3}/g, '');

    var headers = {
      'Content-Type': 'application/x-amz-json-1.1',
      Host: host,
      'X-Amz-Date': datetime,
      'X-Amz-Target': 'Kinesis_20131202.PutRecords',
    };

    if (this.sessionToken) {
      headers['X-Amz-Security-Token'] = this.sessionToken;
    }

    var signedRequest = signRequest({
      method: method,
      host: host,
      path: path,
      queryString: queryString,
      region: this.region,
      headers: headers,
      payload: payload,
      datetime: datetime,
      accessKey: this.accessKeyId,
      secretKey: this.secretAccessKey,
    });

    headers.Authorization = signedRequest;

    http(
      {
        method: method,
        url: protocol + host + path,
        headers: headers,
        body: payload,
      },
      function (err, data) {
        if (err) {
          throw err;
        }

        return callback(null, JSON.parse(data.body));
      }
    );
  } catch (error) {
    callback(error, null);
  }
};

module.exports = Kinesis;

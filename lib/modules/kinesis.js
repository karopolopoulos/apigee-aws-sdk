var Core = require('./core');
var signRequest = require('../helpers/signRequest');
var http = require('../helpers/http');
var utilities = require('../helpers/utilities');

function Kinesis(options) {
  Core.call(this, options);
}

Kinesis.prototype.putRecords = function (params, callback) {
  if (!params || !params.Records || !params.StreamName) {
    throw Error('Required parameters not included');
  }
  params.Records.forEach(function (record) {
    if (!record.Data || !record.PartitionKey) {
      throw Error('Required parameters not included');
    }
  });

  try {
    var protocol = 'https://';
    var method = 'POST';
    var host = 'kinesis.' + this.region + '.amazonaws.com';
    var path = '';
    var queryString = '';

    params.Records = _base64EncodeData(params.Records);
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
        try {
          if (err) {
            return callback(err, null);
          }
          if (data.statusCode >= 400 && data.statusCode <= 599) {
            utilities.handleFailedHttpResponse(data);
          }

          return callback(null, data.body);
        } catch (error) {
          return callback(error, null);
        }
      }
    );
  } catch (error) {
    callback(error, null);
  }
};

function _base64EncodeData(records) {
  var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

  return records.map(function (record) {
    if (!base64Regex.test(record.Data)) {
      record.Data = Buffer.from(record.Data).toString('base64');
    }

    return record;
  });
}

module.exports = Kinesis;

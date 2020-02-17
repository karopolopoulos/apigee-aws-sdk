var Core = require('./core');
var signRequest = require('../helpers/signRequest');
var http = require('../helpers/http');
var utilities = require('../helpers/utilities');

function STS(options) {
  Core.call(this, options);
}

STS.prototype.assumeRole = function(params, callback) {
  if (!params || !params.RoleArn || !params.RoleSessionName) {
    throw Error('Required parameters not included');
  }
  if (params.Tags) {
    params.Tags.forEach(function(tag) {
      if (!tag.Key || !tag.Value) {
        throw Error('Required parameters not included');
      }
    });
  }

  var protocol = 'https://';
  var method = 'POST';
  var host = 'sts.' + this.region + '.amazonaws.com';
  var path = '';
  var queryString = utilities.generateQueryString(params);
  queryString += '&Version=2011-06-15&Action=AssumeRole';

  var datetime = new Date();
  datetime = datetime.toISOString().replace(/[-:]|\.\d{3}/g, '');

  var headers = {
    Host: host,
    'X-Amz-Date': datetime
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
    datetime: datetime,
    accessKey: this.accessKeyId,
    secretKey: this.secretAccessKey
  });

  headers.Authorization = signedRequest;

  try {
    var response = http({
      method: method,
      url: protocol + host + path + '?' + queryString,
      headers: headers
    });

    return callback(null, {
      StatusCode: response.statusCode,
      Payload: response.body
    });
  } catch (error) {
    return callback(error, null);
  }
};

module.exports = STS;

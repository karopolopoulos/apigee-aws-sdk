var SHA256 = require('crypto-js/sha256');
var hmacSHA256 = require('crypto-js/hmac-sha256');

function signRequest(params) {
  var service = params.host.split('.')[0];
  var path = params.path.split('?')[0];
  var queryString = params.path.split('?')[1] || '';
  var payload = params.payload || '';

  var canonicalRequest = _createCanonicalRequest(
    params.method,
    path,
    queryString,
    params.headers,
    payload
  );

  var stringToSign = _createStringToSign(
    params.datetime,
    params.region,
    service,
    canonicalRequest
  );

  var signature = _calculateSignature(
    params.datetime,
    params.secretKey,
    params.region,
    service,
    stringToSign
  );

  return _constructResponse(
    params.accessKey,
    params.datetime,
    params.region,
    service,
    params.headers,
    signature
  );
}

function _createCanonicalRequest(method, path, queryString, headers, payload) {
  return [
    method,
    path,
    queryString,
    _createCanonicalHeaders(headers) + '\n',
    _createSignedHeaders(headers),
    SHA256(payload)
  ].join('\n');
}

function _createCanonicalHeaders(headers) {
  return Object.keys(headers)
    .sort(function(a, b) {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    })
    .map(function(key) {
      return (
        key.toLowerCase() +
        ':' +
        headers[key]
          .toString()
          .trim()
          .replace(/\s+/g, ' ')
      );
    })
    .join('\n');
}

function _createStringToSign(datetime, region, service, canonicalRequest) {
  return [
    'AWS4-HMAC-SHA256',
    datetime,
    _buildCredentialScope(datetime, region, service),
    SHA256(canonicalRequest)
  ].join('\n');
}

function _calculateSignature(
  datetime,
  secretKey,
  region,
  service,
  stringToSign
) {
  var kDate = hmacSHA256(_getDate(datetime), 'AWS4' + secretKey);
  var kRegion = hmacSHA256(region, kDate);
  var kService = hmacSHA256(service, kRegion);
  var kSigning = hmacSHA256('aws4_request', kService);

  return hmacSHA256(stringToSign, kSigning);
}

function _constructResponse(
  accessKey,
  datetime,
  region,
  service,
  headers,
  signature
) {
  return (
    'AWS4-HMAC-SHA256' +
    ' Credential=' +
    accessKey +
    '/' +
    _buildCredentialScope(datetime, region, service) +
    ', SignedHeaders=' +
    _createSignedHeaders(headers) +
    ', Signature=' +
    signature
  );
}

function _buildCredentialScope(datetime, region, service) {
  return _getDate(datetime) + '/' + region + '/' + service + '/aws4_request';
}

function _getDate(datetime) {
  return datetime.split('T')[0];
}

function _createSignedHeaders(headers) {
  return Object.keys(headers)
    .map(function(key) {
      return key.toLowerCase();
    })
    .sort()
    .join(';');
}

module.exports = signRequest;

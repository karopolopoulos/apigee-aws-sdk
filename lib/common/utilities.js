var SHA256 = require('crypto-js/sha256');
var hmacSHA256 = require('crypto-js/hmac-sha256');

function generateAwsSignature(
  host,
  path,
  payload,
  datetime,
  accessKey,
  secretKey,
  region
) {
  // TASK 1: CREATE A CANONICAL REQUEST
  var method = 'POST';
  var canonicalHeaders = [
    'content-type:application/json',
    'host:' + host,
    'x-amz-date:' + datetime,
    'x-amz-invocation-type:RequestResponse\n'
  ].join('\n');
  var signedHeaders = 'content-type;host;x-amz-date;x-amz-invocation-type';
  var payloadHash = SHA256(payload);

  var canonicalRequest = [
    method,
    path,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');

  // TASK 2: CREATE THE STRING TO SIGN
  var algorithm = 'AWS4-HMAC-SHA256';
  var date = datetime.split('T')[0];
  var credentialScope = date + '/' + region + '/lambda/aws4_request';

  var stringToSign = [
    algorithm,
    datetime,
    credentialScope,
    SHA256(canonicalRequest)
  ].join('\n');

  // TASK 3: CALCULATE THE SIGNATURE
  var kDate = hmacSHA256(date, 'AWS4' + secretKey);
  var kRegion = hmacSHA256(region, kDate);
  var kService = hmacSHA256('lambda', kRegion);
  var kSigning = hmacSHA256('aws4_request', kService);

  var signature = hmacSHA256(stringToSign, kSigning);

  // TASK 4: ADD SIGNING INFORMATION TO THE REQUEST
  return (
    algorithm +
    ' Credential=' +
    accessKey +
    '/' +
    credentialScope +
    ', SignedHeaders=' +
    signedHeaders +
    ', Signature=' +
    signature
  );
}

module.exports = { generateAwsSignature };

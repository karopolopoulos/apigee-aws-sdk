var signRequest = require('../../lib/helpers/signRequest');

describe('signRequest Helper', () => {
  test('returns well formated signature for iam', () => {
    const params = {
      method: 'GET',
      host: 'iam.amazonaws.com',
      region: 'us-east-1',
      path: '/?Action=ListUsers&Version=2010-05-08',
      headers: {
        Host: 'iam.amazonaws.com',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'X-Amz-Date': '20150830T123600Z'
      },
      datetime: '20150830T123600Z',
      accessKey: 'AKIDEXAMPLE',
      secretKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY'
    };
    const signature = signRequest(params);

    expect(signature).toEqual(
      'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/iam/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7'
    );
  });

  test('returns well formated signature for lambda', async () => {
    const params = {
      method: 'POST',
      host: 'lambda.ap-southeast-2.amazonaws.com',
      region: 'ap-southeast-2',
      path: '/2015-03-31/functions/hello-world/invocations',
      headers: {
        Host: 'lambda.ap-southeast-2.amazonaws.com',
        'Content-Type': 'application/json',
        'X-Amz-Date': '20150830T123600Z',
        'X-Amz-Invocation-Type': 'RequestResponse'
      },
      datetime: '20150830T123600Z',
      accessKey: 'AKIDEXAMPLE',
      secretKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY'
    };
    const signature = signRequest(params);

    expect(signature).toEqual(
      'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/ap-southeast-2/lambda/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-invocation-type, Signature=3ca3c3c9016656a6250ee5959f3be120de4ad9800c2fb0ae47e80dedfa19c501'
    );
  });
});

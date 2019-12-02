var signRequest = require('../../lib/helpers/signRequest');

describe('signRequest Helper', () => {
  test('returns well formated signature', () => {
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
});

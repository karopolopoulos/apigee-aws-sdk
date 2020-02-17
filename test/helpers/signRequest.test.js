var signRequest = require('../../lib/helpers/signRequest');

describe('signRequest Helper', () => {
  test('returns well formated signature for IAM', () => {
    const params = {
      method: 'GET',
      host: 'iam.amazonaws.com',
      region: 'us-east-1',
      path: '/',
      queryString: 'Action=ListUsers&Version=2010-05-08',
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

  test('returns well formated signature for STS AssumeRole', () => {
    const params = {
      method: 'POST',
      host: 'sts.ap-southeast-2.amazonaws.com',
      region: 'ap-southeast-2',
      path: '/',
      queryString:
        'RoleArn=arn::123&RoleSessionName=testUser&Tags.member.1.Key=tag-value&Tags.member.1.Value=tag-value&TransitiveTagKeys.member.1=a&TransitiveTagKeys.member.2=b&Version=2011-06-15&Action=AssumeRole',
      headers: {
        Host: 'sts.ap-southeast-2.amazonaws.com',
        'X-Amz-Date': '20150830T123600Z'
      },
      datetime: '20150830T123600Z',
      accessKey: 'AKIDEXAMPLE',
      secretKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY'
    };
    const signature = signRequest(params);

    expect(signature).toEqual(
      'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/ap-southeast-2/sts/aws4_request, SignedHeaders=host;x-amz-date, Signature=e4afa09b7bb216fdbb7a11bd9c76d7c5d39f54976e8ff834966a4e423420c56b'
    );
  });

  test('returns well formated signature for Lambda Invoke', async () => {
    const params = {
      method: 'POST',
      host: 'lambda.ap-southeast-2.amazonaws.com',
      region: 'ap-southeast-2',
      path: '/2015-03-31/functions/hello-world/invocations',
      queryString: '',
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

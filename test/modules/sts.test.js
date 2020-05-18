const STS = require('../../lib/modules/sts');
const http = require('../../lib/helpers/http');

jest.mock('../../lib/helpers/http');

describe('STS Module', () => {
  const options = {
    accessKeyId: '123',
    secretAccessKey: '123',
    region: 'ap-southeast-2',
  };
  const sts = new STS(options);

  describe('invoke', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should successfully invoke sts assume role', () => {
      const response = {
        AssumedRoleUser: {
          Arn: 'arn::123/testUser',
          AssumedRoleId: 'ABC123:testUser',
        },
        Credentials: {
          AccessKeyId: '123456',
          Expiration: '2020-02-28T03:25:41Z',
          SecretAccessKey: '123456',
          SessionToken: '123456',
        },
      };

      http.mockImplementation(() => ({
        statusCode: 200,
        body: `<AssumeRoleResponse xmlns="https://sts.amazonaws.com/doc/2011-06-15/">
            <AssumeRoleResult>
                <AssumedRoleUser>
                    <AssumedRoleId>ABC123:testUser</AssumedRoleId>
                    <Arn>arn::123/testUser</Arn>
                </AssumedRoleUser>
                <Credentials>
                    <AccessKeyId>123456</AccessKeyId>
                    <SecretAccessKey>123456</SecretAccessKey>
                    <SessionToken>123456</SessionToken>
                    <Expiration>2020-02-28T03:25:41Z</Expiration>
                </Credentials>
            </AssumeRoleResult>
            <ResponseMetadata>
                <RequestId>203fa10f-ad5f-410d-b5ec-0ea5f0d1ae9a</RequestId>
            </ResponseMetadata>
        </AssumeRoleResponse>`,
      }));

      const params = {
        RoleArn: 'arn::123',
        RoleSessionName: 'testUser',
        Tags: [
          {
            Key: 'tag-value',
            Value: 'tag-value',
          },
        ],
        TransitiveTagKeys: ['a', 'b'],
      };
      sts.assumeRole(params, (err, data) => {
        expect(err).toBeNull();
        expect(data).toMatchObject(response);

        expect(http).toHaveBeenCalledTimes(1);
        expect(http).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: `https://sts.ap-southeast-2.amazonaws.com?RoleArn=${params.RoleArn}&RoleSessionName=${params.RoleSessionName}&Tags.member.1.Key=${params.Tags[0].Key}&Tags.member.1.Value=${params.Tags[0].Value}&TransitiveTagKeys.member.1=${params.TransitiveTagKeys[0]}&TransitiveTagKeys.member.2=${params.TransitiveTagKeys[1]}&Version=2011-06-15&Action=AssumeRole`,
            headers: {
              Authorization: expect.any(String),
              Host: 'sts.ap-southeast-2.amazonaws.com',
              'X-Amz-Date': expect.any(String),
            },
          })
        );
      });
    });

    test('should successfully invoke sts assume role with session token', () => {
      const optionsWithSessionToken = {
        accessKeyId: '123',
        secretAccessKey: '123',
        sessionToken: '123',
        region: 'ap-southeast-2',
      };
      const stsWithSessionToken = new STS(optionsWithSessionToken);

      const response = {
        AssumedRoleUser: {
          Arn: 'arn::123/testUser',
          AssumedRoleId: 'ABC123:testUser',
        },
        Credentials: {
          AccessKeyId: '123456',
          Expiration: '2020-02-28T03:25:41Z',
          SecretAccessKey: '123456',
          SessionToken: '123456',
        },
      };

      http.mockImplementation(() => ({
        statusCode: 200,
        body: `<AssumeRoleResponse xmlns="https://sts.amazonaws.com/doc/2011-06-15/">
            <AssumeRoleResult>
                <AssumedRoleUser>
                    <AssumedRoleId>ABC123:testUser</AssumedRoleId>
                    <Arn>arn::123/testUser</Arn>
                </AssumedRoleUser>
                <Credentials>
                    <AccessKeyId>123456</AccessKeyId>
                    <SecretAccessKey>123456</SecretAccessKey>
                    <SessionToken>123456</SessionToken>
                    <Expiration>2020-02-28T03:25:41Z</Expiration>
                </Credentials>
            </AssumeRoleResult>
            <ResponseMetadata>
                <RequestId>203fa10f-ad5f-410d-b5ec-0ea5f0d1ae9a</RequestId>
            </ResponseMetadata>
        </AssumeRoleResponse>`,
      }));

      const params = {
        RoleArn: 'arn::123',
        RoleSessionName: 'testUser',
        Tags: [
          {
            Key: 'tag-value',
            Value: 'tag-value',
          },
        ],
        TransitiveTagKeys: ['a', 'b'],
      };
      stsWithSessionToken.assumeRole(params, (err, data) => {
        expect(err).toBeNull();
        expect(data).toMatchObject(response);

        expect(http).toHaveBeenCalledTimes(1);
        expect(http).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: `https://sts.ap-southeast-2.amazonaws.com?RoleArn=${params.RoleArn}&RoleSessionName=${params.RoleSessionName}&Tags.member.1.Key=${params.Tags[0].Key}&Tags.member.1.Value=${params.Tags[0].Value}&TransitiveTagKeys.member.1=${params.TransitiveTagKeys[0]}&TransitiveTagKeys.member.2=${params.TransitiveTagKeys[1]}&Version=2011-06-15&Action=AssumeRole`,
            headers: {
              Authorization: expect.any(String),
              Host: 'sts.ap-southeast-2.amazonaws.com',
              'X-Amz-Date': expect.any(String),
              'X-Amz-Security-Token': '123',
            },
          })
        );
      });
    });

    test('should handle error body from sts assume role', () => {
      const response = {
        Type: 'Sender',
        Code: 'SignatureDoesNotMatch',
        Message:
          'The request signature we calculated does not match the signature you provided. Check your AWS Secret Access Key and signing method. Consult the service documentation for details.',
      };

      http.mockImplementation(() => ({
        statusCode: 200,
        body: `<ErrorResponse xmlns="https://sts.amazonaws.com/doc/2011-06-15/">
            <Error>
                <Type>Sender</Type>
                <Code>SignatureDoesNotMatch</Code>
                <Message>The request signature we calculated does not match the signature you provided. Check your AWS Secret Access Key and signing method. Consult the service documentation for details.</Message>
            </Error>
            <RequestId>5d1dfd4e-36f9-4d6d-a78e-90b72670c129</RequestId>
        </ErrorResponse>`,
      }));

      const params = {
        RoleArn: 'arn::123',
        RoleSessionName: 'testUser',
        Tags: [
          {
            Key: 'tag-value',
            Value: 'tag-value',
          },
        ],
        TransitiveTagKeys: ['a', 'b'],
      };
      sts.assumeRole(params, (err, data) => {
        expect(data).toBeNull();
        expect(err).toBeInstanceOf(Error);
        expect(err).toEqual(new Error(JSON.stringify(response)));

        expect(http).toHaveBeenCalledTimes(1);
        expect(http).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: `https://sts.ap-southeast-2.amazonaws.com?RoleArn=${params.RoleArn}&RoleSessionName=${params.RoleSessionName}&Tags.member.1.Key=${params.Tags[0].Key}&Tags.member.1.Value=${params.Tags[0].Value}&TransitiveTagKeys.member.1=${params.TransitiveTagKeys[0]}&TransitiveTagKeys.member.2=${params.TransitiveTagKeys[1]}&Version=2011-06-15&Action=AssumeRole`,
            headers: {
              Authorization: expect.any(String),
              Host: 'sts.ap-southeast-2.amazonaws.com',
              'X-Amz-Date': expect.any(String),
            },
          })
        );
      });
    });

    test('should return all errors unchanged', () => {
      http.mockImplementation(() => {
        throw new Error('this is an error');
      });

      const params = {
        RoleArn: 'arn::123',
        RoleSessionName: 'testUser',
      };
      sts.assumeRole(params, (err, data) => {
        expect(data).toBeNull();
        expect(err.message).toEqual('this is an error');
      });
    });

    test('should throw required params error', () => {
      expect(() => {
        sts.assumeRole();
      }).toThrow('Required parameters not included');

      expect(() => {
        sts.assumeRole({
          RoleArn: '123',
          RoleSessionName: '123',
          Tags: [{ Key: 'aKey' }],
        });
      }).toThrow('Required parameters not included');
    });
  });
});

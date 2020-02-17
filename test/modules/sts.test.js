const STS = require('../../lib/modules/sts');
const http = require('../../lib/helpers/http');

jest.mock('../../lib/helpers/http');

describe('STS Module', () => {
  const options = {
    accessKeyId: '123',
    secretAccessKey: '123',
    region: 'ap-southeast-2'
  };
  const sts = new STS(options);

  describe('invoke', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should successfully invoke sts', () => {
      const response = {
        StatusCode: 200,
        Payload:
          '{"Credentials": {"AccessKeyId": "456", "SecretAccessKey": "789", "SessionToken": "012", "Expiration": "2019-11-09T13:34:41Z"}, "AssumedRoleUser": {"AssumedRoleId": "123", "Arn": "arn::123"}, "PackedPolicySize": 1}'
      };

      http.mockImplementation(() => ({
        statusCode: response.StatusCode,
        body: response.Payload
      }));

      const params = {
        RoleArn: 'arn::123',
        RoleSessionName: 'testUser',
        Tags: [
          {
            Key: 'tag-value',
            Value: 'tag-value'
          }
        ],
        TransitiveTagKeys: ['a', 'b']
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
              'X-Amz-Date': expect.any(String)
            }
          })
        );
      });
    });

    test('should successfully invoke sts with session token', () => {
      const optionsWithSessionToken = {
        accessKeyId: '123',
        secretAccessKey: '123',
        sessionToken: '123',
        region: 'ap-southeast-2'
      };
      const stsWithSessionToken = new STS(optionsWithSessionToken);

      const response = {
        StatusCode: 200,
        Payload:
          '{"Credentials": {"AccessKeyId": "456", "SecretAccessKey": "789", "SessionToken": "012", "Expiration": "2019-11-09T13:34:41Z"}, "AssumedRoleUser": {"AssumedRoleId": "123", "Arn": "arn::123"}, "PackedPolicySize": 1}'
      };

      http.mockImplementation(() => ({
        statusCode: response.StatusCode,
        body: response.Payload
      }));

      const params = {
        RoleArn: 'arn::123',
        RoleSessionName: 'testUser',
        Tags: [
          {
            Key: 'tag-value',
            Value: 'tag-value'
          }
        ],
        TransitiveTagKeys: ['a', 'b']
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
              'X-Amz-Security-Token': '123'
            }
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
        RoleSessionName: 'testUser'
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
    });
  });
});

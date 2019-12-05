const Lambda = require('../../lib/modules/lambda');
const http = require('../../lib/helpers/http');

jest.mock('../../lib/helpers/http');

describe('Lambda Module', () => {
  const options = {
    accessKeyId: '123',
    secretAccessKey: '123',
    region: 'ap-southeast-2'
  };
  const lambda = new Lambda(options);

  describe('invoke', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should successfully invoke lambda', () => {
      const response = {
        StatusCode: 200,
        ExecutedVersion: 'value',
        LogResult: 'value',
        Payload: '{"message":"A test response"}'
      };

      http.mockImplementation(() => ({
        statusCode: response.StatusCode,
        headers: {
          'X-Amz-Executed-Version': response.ExecutedVersion,
          'X-Amz-Log-Result': response.LogResult
        },
        body: response.Payload
      }));

      const params = {
        FunctionName: 'hello-world',
        Payload: '{"message":"A test request"}',
        LogType: 'Tail',
        ClientContext: '123',
        Qualifier: '1.0'
      };
      lambda.invoke(params, (err, data) => {
        expect(err).toBeNull();
        expect(data).toMatchObject(response);

        expect(http).toHaveBeenCalledTimes(1);
        expect(http).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: `https://lambda.ap-southeast-2.amazonaws.com/2015-03-31/functions/${params.FunctionName}/invocations?Qualifier=${params.Qualifier}`,
            headers: {
              Authorization: expect.any(String),
              'Content-Type': 'application/json',
              Host: 'lambda.ap-southeast-2.amazonaws.com',
              'X-Amz-Client-Context': params.ClientContext,
              'X-Amz-Date': expect.any(String),
              'X-Amz-Invocation-Type': 'RequestResponse',
              'X-Amz-Log-Type': params.LogType
            },
            body: params.Payload
          })
        );
      });
    });

    test('should return all errors unchanged', () => {
      http.mockImplementation(() => {
        throw new Error('this is an error');
      });

      const params = {
        FunctionName: 'hello-world',
        Payload: '{"message":"A test request"}'
      };
      lambda.invoke(params, (err, data) => {
        expect(data).toBeNull();
        expect(err.message).toEqual('this is an error');
      });
    });

    test('should throw required params error', () => {
      expect(() => {
        lambda.invoke();
      }).toThrow('FunctionName is a required paramter');
    });
  });
});

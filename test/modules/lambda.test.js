const Lambda = require('../../lib/modules/lambda');
const http = require('../../lib/helpers/http');

jest.mock('../../lib/helpers/http');

describe('Lambda Module', () => {
  const options = {
    accessKeyId: '123',
    secretAccessKey: '123',
    region: 'ap-southeast-2',
  };
  const lambda = new Lambda(options);

  describe('invoke', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should successfully invoke lambda', () => {
      return new Promise((done) => {
        const response = {
          StatusCode: 200,
          ExecutedVersion: 'value',
          LogResult: 'value',
          Payload: '{"message":"A test response"}',
        };

        http.mockImplementation((_, callback) => {
          return callback(null, {
            statusCode: response.StatusCode,
            headers: {
              'X-Amz-Executed-Version': response.ExecutedVersion,
              'X-Amz-Log-Result': response.LogResult,
            },
            body: JSON.parse(response.Payload),
          });
        });

        const params = {
          FunctionName: 'hello-world',
          Payload: '{"message":"A test request"}',
          LogType: 'Tail',
          ClientContext: '123',
        };
        lambda.invoke(params, (err, data) => {
          expect(err).toBeNull();
          expect(data).toMatchObject(response);

          expect(http).toHaveBeenCalledTimes(1);
          expect(http).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'POST',
              url: `https://lambda.ap-southeast-2.amazonaws.com/2015-03-31/functions/${params.FunctionName}/invocations`,
              headers: {
                Authorization: expect.any(String),
                Host: 'lambda.ap-southeast-2.amazonaws.com',
                'X-Amz-Client-Context': params.ClientContext,
                'X-Amz-Date': expect.any(String),
                'X-Amz-Invocation-Type': 'RequestResponse',
                'X-Amz-Log-Type': params.LogType,
              },
              body: params.Payload,
            }),
            expect.any(Function)
          );
          done();
        });
      });
    });

    test('should successfully invoke lambda with session token', () => {
      return new Promise((done) => {
        const optionsWithSessionToken = {
          accessKeyId: '123',
          secretAccessKey: '123',
          sessionToken: '123',
          region: 'ap-southeast-2',
        };
        const lambdaWithSessionToken = new Lambda(optionsWithSessionToken);

        const response = {
          StatusCode: 200,
          ExecutedVersion: 'value',
          LogResult: 'value',
          Payload: '{"message":"A test response"}',
        };

        http.mockImplementation((_, callback) => {
          return callback(null, {
            statusCode: response.StatusCode,
            headers: {
              'X-Amz-Executed-Version': response.ExecutedVersion,
              'X-Amz-Log-Result': response.LogResult,
            },
            body: JSON.parse(response.Payload),
          });
        });

        const params = {
          FunctionName: 'hello-world',
          Payload: '{"message":"A test request"}',
          LogType: 'Tail',
          ClientContext: '123',
          Qualifier: '1.0',
        };
        lambdaWithSessionToken.invoke(params, (err, data) => {
          expect(err).toBeNull();
          expect(data).toMatchObject(response);

          expect(http).toHaveBeenCalledTimes(1);
          expect(http).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'POST',
              url: `https://lambda.ap-southeast-2.amazonaws.com/2015-03-31/functions/${params.FunctionName}/invocations?Qualifier=${params.Qualifier}`,
              headers: {
                Authorization: expect.any(String),
                Host: 'lambda.ap-southeast-2.amazonaws.com',
                'X-Amz-Client-Context': params.ClientContext,
                'X-Amz-Date': expect.any(String),
                'X-Amz-Invocation-Type': 'RequestResponse',
                'X-Amz-Log-Type': params.LogType,
                'X-Amz-Security-Token': '123',
              },
              body: params.Payload,
            }),
            expect.any(Function)
          );
          done();
        });
      });
    });

    test('should handle AWS returning HTTP error', () => {
      return new Promise((done) => {
        const response = {
          __type: 'ConfigException',
          message: 'The config was wrong',
        };

        http.mockImplementation((_, callback) => {
          return callback(null, {
            statusCode: 400,
            body: response,
          });
        });

        const params = {
          FunctionName: 'hello-world',
          Payload: '{"message":"A test request"}',
        };
        lambda.invoke(params, (err, data) => {
          expect(data).toBeNull();
          expect(err).toBeInstanceOf(Error);
          expect(err.code).toEqual('ConfigException');
          expect(err.message).toEqual('The config was wrong');
          done();
        });
      });
    });

    test('should handle unknown http errors', () => {
      return new Promise((done) => {
        http.mockImplementation((_, callback) => {
          return callback(null, {
            statusCode: 400,
          });
        });

        const params = {
          FunctionName: 'hello-world',
          Payload: '{"message":"A test request"}',
        };
        lambda.invoke(params, (err, data) => {
          expect(data).toBeNull();
          expect(err).toBeInstanceOf(Error);
          expect(err.code).toEqual('UnknownErrorException');
          expect(err.message).toEqual('An unknown error occurred');
          done();
        });
      });
    });

    test('should return all errors unchanged', () => {
      return new Promise((done) => {
        http.mockImplementation((_, callback) => {
          return callback(new Error('this is an error'), null);
        });

        const params = {
          FunctionName: 'hello-world',
          Payload: '{"message":"A test request"}',
        };
        lambda.invoke(params, (err, data) => {
          expect(data).toBeNull();
          expect(err.message).toEqual('this is an error');
          done();
        });
      });
    });

    test('should throw required params error', () => {
      expect(() => {
        lambda.invoke();
      }).toThrow('Required parameters not included');
    });
  });
});

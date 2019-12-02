const Lambda = require('../../lib/modules/lambda');

describe('Lambda Module', () => {
  const options = {
    accessKeyId: '123',
    secretAccessKey: '123',
    region: 'ap-southeast-2'
  };
  const lambda = new Lambda(options);

  describe('invoke', () => {
    const response = {
      StatusCode: 200,
      ExecutedVersion: 'value',
      LogResult: 'value',
      Payload: '{"message":"A test response"}'
    };

    const httpMock = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      status: response.StatusCode,
      getResponseHeader: jest.fn(() => response.ExecutedVersion),
      response: response.Payload
    };
    // eslint-disable-next-line no-undef
    window.XMLHttpRequest = jest.fn(() => httpMock);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should successfully invoke lambda', () => {
      const params = {
        FunctionName: 'hello-world',
        Payload: '{"message":"A test request"}'
      };
      lambda.invoke(params, (err, data) => {
        expect(err).toBeNull();
        expect(data).toMatchObject(response);

        expect(httpMock.open).toHaveBeenCalledWith(
          'POST',
          `https://lambda.${options.region}.amazonaws.com/2015-03-31/functions/${params.FunctionName}/invocations`,
          false
        );
        expect(httpMock.setRequestHeader).toHaveBeenCalledTimes(5);

        expect(httpMock.setRequestHeader).toHaveBeenNthCalledWith(
          1,
          'Content-Type',
          'application/json'
        );
        expect(httpMock.setRequestHeader).toHaveBeenNthCalledWith(
          2,
          'Host',
          `lambda.${options.region}.amazonaws.com`
        );
        expect(httpMock.setRequestHeader).toHaveBeenNthCalledWith(
          3,
          'X-Amz-Date',
          expect.anything()
        );
        expect(httpMock.setRequestHeader).toHaveBeenNthCalledWith(
          4,
          'X-Amz-Invocation-Type',
          'RequestResponse'
        );
        expect(httpMock.setRequestHeader).toHaveBeenNthCalledWith(
          5,
          'Authorization',
          expect.anything()
        );
        expect(httpMock.send).toHaveBeenCalledTimes(1);
        expect(httpMock.getResponseHeader).toHaveBeenCalledTimes(3);
        expect(httpMock.getResponseHeader).toHaveBeenNthCalledWith(
          1,
          'X-Amz-Executed-Version'
        );
        expect(httpMock.getResponseHeader).toHaveBeenNthCalledWith(
          2,
          'X-Amz-Function-Error'
        );
        expect(httpMock.getResponseHeader).toHaveBeenNthCalledWith(
          3,
          'X-Amz-Log-Result'
        );
      });
    });

    test('should return all errors unchanged', () => {
      httpMock.send.mockImplementation(() => {
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
  });
});

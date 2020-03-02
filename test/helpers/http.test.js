const http = require('../../lib/helpers/http');

describe('http Helper', () => {
  describe('GET call', () => {
    const params = {
      method: 'GET',
      url: 'https://this-is-a-url.com/a/path',
      headers: {
        'Input-Header': 'input-value',
        'Input-Header-2': 'input-value-2'
      }
    };

    const expectedResponse = {
      statusCode: 200,
      headers: {
        'A-Header': 'a-value',
        'B-Header': 'b-value'
      }
    };

    test('sends GET call using XMLHttpRequest', () => {
      const httpMock = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn(),
        status: expectedResponse.statusCode,
        getAllResponseHeaders: jest.fn(
          () => 'a-header: a-value\r\nb-header: b-value\r\n'
        )
      };
      // eslint-disable-next-line no-undef
      window.XMLHttpRequest = jest.fn(() => httpMock);

      const response = http(params);

      expect(response).toMatchObject(expectedResponse);
      expect(httpMock.open).toHaveBeenCalledWith(
        params.method,
        params.url,
        false
      );
      expect(httpMock.setRequestHeader).toHaveBeenCalledTimes(2);
      expect(httpMock.setRequestHeader).toHaveBeenNthCalledWith(
        1,
        'Input-Header',
        'input-value'
      );
      expect(httpMock.setRequestHeader).toHaveBeenNthCalledWith(
        2,
        'Input-Header-2',
        'input-value-2'
      );
      expect(httpMock.send).toHaveBeenCalledTimes(1);
      expect(httpMock.getAllResponseHeaders).toHaveBeenCalledTimes(1);
    });

    test('sends GET call using Request', () => {
      // eslint-disable-next-line no-undef
      window.XMLHttpRequest = undefined;
      // eslint-disable-next-line no-undef
      Request = jest.fn();
      const httpMock = {
        waitForComplete: jest.fn(),
        isError: jest.fn(),
        isSuccess: jest.fn(),
        getResponse: jest.fn(() => ({
          status: {
            code: expectedResponse.statusCode
          },
          headers: expectedResponse.headers,
          content: {
            asJSON: undefined
          }
        }))
      };
      // eslint-disable-next-line no-undef
      httpClient = {
        send: jest.fn(() => httpMock)
      };

      const response = http(params);

      expect(response).toMatchObject(expectedResponse);
      // eslint-disable-next-line no-undef
      expect(Request).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line no-undef
      expect(Request).toHaveBeenCalledWith(
        params.url,
        params.method,
        params.headers
      );
      // eslint-disable-next-line no-undef
      expect(httpClient.send).toHaveBeenCalledTimes(1);
      expect(httpMock.waitForComplete).toHaveBeenCalledTimes(1);
      expect(httpMock.isError).toHaveBeenCalledTimes(1);
      expect(httpMock.getResponse).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST call', () => {
    const params = {
      method: 'POST',
      url: 'https://this-is-a-url.com/a/path',
      headers: {
        'Input-Header': 'input-value',
        'Input-Header-2': 'input-value-2'
      },
      body: '{"message":"A test request"}'
    };

    const expectedResponse = {
      statusCode: 200,
      headers: {
        'A-Header': 'a-value',
        'B-Header': 'b-value'
      },
      body: '{"message":"A test response"}'
    };

    test('sends POST call using XMLHttpRequest', () => {
      const httpMock = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn(),
        status: expectedResponse.statusCode,
        getAllResponseHeaders: jest.fn(
          () => 'a-header: a-value\r\nb-header: b-value\r\n'
        ),
        response: expectedResponse.body
      };
      // eslint-disable-next-line no-undef
      window.XMLHttpRequest = jest.fn(() => httpMock);

      const response = http(params);

      expect(response).toMatchObject(expectedResponse);
      expect(httpMock.open).toHaveBeenCalledWith(
        params.method,
        params.url,
        false
      );
      expect(httpMock.setRequestHeader).toHaveBeenCalledTimes(2);
      expect(httpMock.setRequestHeader).toHaveBeenNthCalledWith(
        1,
        'Input-Header',
        'input-value'
      );
      expect(httpMock.setRequestHeader).toHaveBeenNthCalledWith(
        2,
        'Input-Header-2',
        'input-value-2'
      );
      expect(httpMock.send).toHaveBeenCalledTimes(1);
      expect(httpMock.getAllResponseHeaders).toHaveBeenCalledTimes(1);
    });

    test('sends POST call using Request', () => {
      // eslint-disable-next-line no-undef
      window.XMLHttpRequest = undefined;
      // eslint-disable-next-line no-undef
      Request = jest.fn();
      const httpMock = {
        waitForComplete: jest.fn(),
        isError: jest.fn(),
        isSuccess: jest.fn(),
        getResponse: jest.fn(() => ({
          status: {
            code: expectedResponse.statusCode
          },
          headers: expectedResponse.headers,
          content: {
            asJSON: JSON.parse(expectedResponse.body)
          }
        }))
      };
      // eslint-disable-next-line no-undef
      httpClient = {
        send: jest.fn(() => httpMock)
      };

      const response = http(params);

      expect(response).toMatchObject(expectedResponse);
      // eslint-disable-next-line no-undef
      expect(Request).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line no-undef
      expect(Request).toHaveBeenCalledWith(
        params.url,
        params.method,
        params.headers,
        params.body
      );
      // eslint-disable-next-line no-undef
      expect(httpClient.send).toHaveBeenCalledTimes(1);
      expect(httpMock.waitForComplete).toHaveBeenCalledTimes(1);
      expect(httpMock.isError).toHaveBeenCalledTimes(1);
      expect(httpMock.getResponse).toHaveBeenCalledTimes(1);
    });
  });

  test('no libraries available to make a call', () => {
    const params = {
      method: 'POST',
      url: 'https://this-is-a-url.com/a/path',
      headers: {
        'Input-Header': 'input-value',
        'Input-Header-2': 'input-value-2'
      },
      body: '{"message":"A test request"}'
    };

    // eslint-disable-next-line no-undef
    window.XMLHttpRequest = undefined;
    // eslint-disable-next-line no-undef
    Request = undefined;

    let response;
    let error;
    try {
      response = http(params);
    } catch (err) {
      error = err;
    }

    expect(response).toBeUndefined();
    expect(error).toBeInstanceOf(Error);
    expect(error).toEqual(new Error('No library to make http call'));
  });
});

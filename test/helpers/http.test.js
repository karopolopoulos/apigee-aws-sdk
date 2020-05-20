const http = require('../../lib/helpers/http');

describe('http Helper', () => {
  describe('GET call', () => {
    const params = {
      method: 'GET',
      url: 'https://this-is-a-url.com/a/path',
      headers: {
        'Input-Header': 'input-value',
        'Input-Header-2': 'input-value-2',
      },
    };

    const expectedResponse = {
      statusCode: 200,
      headers: {
        'A-Header': 'a-value',
        'B-Header': 'b-value',
      },
    };

    test('sends GET call using XMLHttpRequest', () => {
      return new Promise((done) => {
        const httpMock = {
          open: jest.fn(),
          setRequestHeader: jest.fn(),
          send: jest.fn(),
          status: expectedResponse.statusCode,
          getAllResponseHeaders: jest.fn(
            () => 'a-header: a-value\r\nb-header: b-value\r\n'
          ),
        };
        window.XMLHttpRequest = jest.fn(() => httpMock);

        http(params, function (err, data) {
          expect(err).toBeNull();
          expect(data).toMatchObject(expectedResponse);
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
          done();
        });
      });
    });

    test('sends GET call using Request', () => {
      return new Promise((done) => {
        window.XMLHttpRequest = undefined;
        // eslint-disable-next-line no-global-assign
        Request = jest.fn();
        // eslint-disable-next-line no-undef
        httpClient = {
          send: jest.fn((_, callback) => {
            return callback(
              {
                status: {
                  code: expectedResponse.statusCode,
                },
                headers: expectedResponse.headers,
                content: {
                  asJSON: undefined,
                },
              },
              null
            );
          }),
        };

        http(params, function (err, data) {
          expect(err).toBeNull();
          expect(data).toMatchObject(expectedResponse);
          expect(Request).toHaveBeenCalledTimes(1);
          expect(Request).toHaveBeenCalledWith(
            params.url,
            params.method,
            params.headers
          );
          // eslint-disable-next-line no-undef
          expect(httpClient.send).toHaveBeenCalledTimes(1);
          done();
        });
      });
    });
  });

  describe('POST call', () => {
    const params = {
      method: 'POST',
      url: 'https://this-is-a-url.com/a/path',
      headers: {
        'Input-Header': 'input-value',
        'Input-Header-2': 'input-value-2',
      },
      body: '{"message":"A test request"}',
    };

    const expectedResponse = {
      statusCode: 200,
      headers: {
        'A-Header': 'a-value',
        'B-Header': 'b-value',
      },
      body: { message: 'A test response' },
    };

    // test('sends POST call using XMLHttpRequest', () => {
    //   return new Promise((done) => {
    //     const httpMock = {
    //       open: jest.fn(),
    //       setRequestHeader: jest.fn(),
    //       send: jest.fn(),
    //       status: expectedResponse.statusCode,
    //       getAllResponseHeaders: jest.fn(
    //         () => 'a-header: a-value\r\nb-header: b-value\r\n'
    //       ),
    //       response: JSON.stringify(expectedResponse.body),
    //     };
    //     window.XMLHttpRequest = jest.fn(() => httpMock);

    //     http(params, function (err, data) {
    //       console.log(data);
    //       expect(err).toBeNull();
    //       expect(data).toMatchObject(expectedResponse);
    //       expect(httpMock.open).toHaveBeenCalledWith(
    //         params.method,
    //         params.url,
    //         false
    //       );
    //       expect(httpMock.setRequestHeader).toHaveBeenCalledTimes(2);
    //       expect(httpMock.setRequestHeader).toHaveBeenNthCalledWith(
    //         1,
    //         'Input-Header',
    //         'input-value'
    //       );
    //       expect(httpMock.setRequestHeader).toHaveBeenNthCalledWith(
    //         2,
    //         'Input-Header-2',
    //         'input-value-2'
    //       );
    //       expect(httpMock.send).toHaveBeenCalledTimes(1);
    //       expect(httpMock.getAllResponseHeaders).toHaveBeenCalledTimes(1);
    //       done();
    //     });
    //   });
    // });

    test('sends POST call using Request', () => {
      return new Promise((done) => {
        window.XMLHttpRequest = undefined;
        // eslint-disable-next-line no-global-assign
        Request = jest.fn();
        // eslint-disable-next-line no-undef
        httpClient = {
          send: jest.fn((_, callback) => {
            return callback(
              {
                status: {
                  code: expectedResponse.statusCode,
                },
                headers: expectedResponse.headers,
                content: {
                  asJSON: expectedResponse.body,
                },
              },
              null
            );
          }),
        };

        http(params, function (err, data) {
          expect(err).toBeNull();
          expect(data).toEqual(expectedResponse);
          expect(Request).toHaveBeenCalledTimes(1);
          expect(Request).toHaveBeenCalledWith(
            params.url,
            params.method,
            params.headers,
            params.body
          );
          // eslint-disable-next-line no-undef
          expect(httpClient.send).toHaveBeenCalledTimes(1);
          done();
        });
      });
    });
  });

  test('no libraries available to make a call', () => {
    const params = {
      method: 'POST',
      url: 'https://this-is-a-url.com/a/path',
      headers: {
        'Input-Header': 'input-value',
        'Input-Header-2': 'input-value-2',
      },
      body: '{"message":"A test request"}',
    };

    window.XMLHttpRequest = undefined;
    // eslint-disable-next-line no-global-assign
    Request = undefined;

    let error;
    try {
      http(params);
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(Error);
    expect(error).toEqual(new Error('No library to make http call'));
  });
});

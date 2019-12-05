var http = require('../../lib/helpers/http');

describe('http Helper', () => {
  test('sends call using XMLHttpRequest', () => {
    const expectedResponse = {
      statusCode: 200,
      headers: {
        'A-Header': 'a-value',
        'B-Header': 'b-value'
      },
      body: '{"message":"A test response"}'
    };

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

    const params = {
      method: 'POST',
      url: 'https://this-is-a-url.com/a/path',
      headers: {
        'Input-Header': 'input-value',
        'Input-Header-2': 'input-value-2'
      },
      body: '{"message":"A test request"}'
    };
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

  test('sends call using Request', () => {});
});

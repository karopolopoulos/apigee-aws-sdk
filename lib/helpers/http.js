function http(params) {
  var response;
  if (typeof XMLHttpRequest !== 'undefined') {
    response = _xmlHttpRequest(params);
  } else if (typeof Request !== 'undefined') {
    response = _request(params);
  } else {
    throw new Error('No library to make http call');
  }

  return response;
}

function _xmlHttpRequest(params) {
  // eslint-disable-next-line no-undef
  var request = new XMLHttpRequest();
  request.open(params.method, params.url, false);
  Object.keys(params.headers).forEach(function(header) {
    request.setRequestHeader(header, params.headers[header]);
  });

  if (params.body) {
    request.send(params.body);
  } else {
    request.send();
  }

  var rawHeaders = request
    .getAllResponseHeaders()
    .trim()
    .split(/[\r\n]+/);
  var headers = {};
  rawHeaders.forEach(function(header) {
    var parts = header.split(': ');
    var key = parts.shift();
    var value = parts.join(': ');

    key = key
      .split('-')
      .map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join('-');
    headers[key] = value;
  });

  return {
    statusCode: request.status,
    headers: headers,
    body: request.response
  };
}

function _request(params) {
  var request;
  if (params.body) {
    // eslint-disable-next-line no-undef
    request = new Request(
      params.url,
      params.method,
      params.headers,
      params.body
    );
  } else {
    // eslint-disable-next-line no-undef
    request = new Request(params.url, params.method, params.headers);
  }

  // eslint-disable-next-line no-undef
  var exchange = httpClient.send(request);
  exchange.waitForComplete();

  if (exchange.isError()) {
    throw new Error(exchange.getError());
  }

  var response = exchange.getResponse();

  // print(response);
  // print(response.content);
  // print(response.content.asJSON);

  return {
    statusCode: response.status.code,
    headers: response.headers,
    body: JSON.stringify(response.content.asJSON)
  };
}

module.exports = http;

// eslint-disable-next-line consistent-return
function http(params, callback) {
  if (typeof Request !== 'undefined') {
    _request(params, function(err, data) {
      if (err) {
        return callback(err, null);
      }

      return callback(null, data);
    });
  } else if (typeof XMLHttpRequest !== 'undefined') {
    return callback(null, _xmlHttpRequest(params));
  } else {
    throw new Error('No library to make http call');
  }
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

function _request(params, callback) {
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
  httpClient.send(request, function(response, error) {
    if (error) {
      return callback(error, null);
    }

    var body;
    if (response.content.asJSON) {
      body = JSON.stringify(response.content.asJSON);
    } else if (response.content.asXML) {
      body = response.content.asXML;
    } else {
      body = response.content;
    }

    return callback(null, {
      statusCode: response.status.code,
      headers: response.headers,
      body: body
    });
  });
}

module.exports = http;

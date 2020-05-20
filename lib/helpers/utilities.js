function generateQueryString(queryParams) {
  return Object.keys(queryParams)
    .map(function (queryParamsKey) {
      if (queryParams[queryParamsKey] instanceof Array) {
        return queryParams[queryParamsKey]
          .map(function (queryParam, i) {
            if (queryParam instanceof Object) {
              return Object.keys(queryParam)
                .map(function (queryParamKey) {
                  return (
                    queryParamsKey +
                    '.member.' +
                    (i + 1).toString() +
                    '.' +
                    queryParamKey +
                    '=' +
                    queryParam[queryParamKey]
                  );
                })
                .join('&');
            }

            return (
              queryParamsKey +
              '.member.' +
              (i + 1).toString() +
              '=' +
              queryParam
            );
          })
          .join('&');
      }

      return queryParamsKey + '=' + queryParams[queryParamsKey];
    })
    .join('&');
}

function handleFailedHttpResponse(response) {
  var CustomError;
  if (!response.body || !response.body.__type) {
    CustomError = createCustomError('UnknownErrorException');
    throw new CustomError('An unknown error occurred');
  }

  CustomError = createCustomError(response.body.__type);
  throw new CustomError(response.body.message);
}

function createCustomError(name) {
  function CustomError(message) {
    this.message = message;
    this.code = CustomError.prototype.name;
  }

  CustomError.prototype = new Error();
  CustomError.prototype.name = name;

  return CustomError;
}

module.exports = {
  generateQueryString: generateQueryString,
  handleFailedHttpResponse: handleFailedHttpResponse,
  createCustomError: createCustomError,
};

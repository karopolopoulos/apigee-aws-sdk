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

module.exports = { generateQueryString: generateQueryString };

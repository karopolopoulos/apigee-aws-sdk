# Apigee AWS SDK

![npm](https://img.shields.io/npm/v/npm)

This package is primarily focused at enabling Apigee users to integrate with AWS services directly from a [JavaScript Policy](https://docs.apigee.com/api-platform/reference/policies/javascript-policy).

Although there are already many great libraries that allow integration into AWS services (including the actual [aws-sdk](https://www.npmjs.com/package/aws-sdk)!) I found that the situation I was in did not allow me to use them :sob: :rage:.

Currently it supports the following services:

- Lambda

## Installation

```shell
npm install apigee-aws-sdk
```

## Examples

### Importing

```js
// import entire SDK
var apigeeAwsSdk = require('apigee-aws-sdk');
// import individual modules
var Lambda = require('apigee-aws-sdk/modules/lambda');
```

### Usage

```js
var Lambda = require('apigee-aws-sdk/modules/lambda');

var options = {
  accessKeyId: '<value>',
  secretAccessKey: '<value>',
  region: '<value>'
};
var lambda = new Lambda(options);

var params = {
  functionName: 'hello-world',
  payload: <string>
};
lambda.invoke(params, function(err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data)
  }
});
```

## API

Patience friends...

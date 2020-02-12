# Guides

## Bundling for Apigee

Apigee does not allow you to import packages from a package manager for a Javascript Policy. Instead all the files must be uploaded together before deployment. This can be achieved by first bundling with [webpack](https://www.npmjs.com/package/webpack) then uploading the bundle as a new revision.

There are a few steps to achieve this:

### Install webpack locally

```
$ npm install --save-dev webpack webpack-cli
```

### Create `webpack.config.js` file

Here you can specify the entry point to your javascript policy in order to bundle it and all of its dependencies.

```js
const path = require('path');

module.exports = {
  entry: {
    index: './index.js'
    // other: './other.js' (if you have other files)
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './build')
  },
  mode: 'production'
};
```

### Bundling

From here you can run the webpack command to bundle the packages then zip it up with your Apigee apiproxy and upload it as a new revision.

```
$ webpack --config webpack.config.js
```

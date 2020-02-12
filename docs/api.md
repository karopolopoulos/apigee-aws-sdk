# API Reference

## Lambda

### new Lambda(options)

Creates a new Lambda object.

| Param                   | Type     | Description       |
| ----------------------- | -------- | ----------------- |
| options                 | `Object` |                   |
| options.accessKeyId     | `String` | AWS access key ID |
| options.secretAccessKey | `String` | AWS secret key    |
| options.region          | `String` | AWS region        |

#### lambda.invoke(params, callback)

Invokes a Lambda function.

Request:

| Param                                                            | Type       | Description                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| params                                                           | `Object`   |                                                                                                                                                                                                                                                    |
| params.FunctionName <span style="color: red">**required**</span> | `String`   | The name of your lambda function                                                                                                                                                                                                                   |
| params.Payload                                                   | `String`   | The stringified JSON that you want to provide to your Lambda function as input                                                                                                                                                                     |
| params.InvocationType                                            | `String`   | How you would like to invoke your function. Options: <ul><li>`RequestResponse` **(default)** - Invoke lambda synchronously</li><li>`Event` - Invoke lambda asynchronously</li><li>`DryRun` - Validate parameters without invoking lambda</li></ul> |
| params.LogType                                                   | `String`   | Include details of the execution log in your response. Options: <ul><li>`None` - Don't supply any logs</li><li>`Tail` - Include logs</li></ul>                                                                                                     |
| params.ClientContext                                             | `String`   | Up to 3583 bytes of base64-encoded data about the invoking client to pass to the function in the context object                                                                                                                                    |
| params.Qualifier                                                 | `String`   | Specify a version or alias to invoke a published version of the function                                                                                                                                                                           |
| callback                                                         | `function` |                                                                                                                                                                                                                                                    |

Callback:

| Param                | Type      | Description                                                                                                                                                                                                                                                                                                                 |
| -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| err                  | `Error`   | The error object returned from the request. Set to null if the request is successful                                                                                                                                                                                                                                        |
| data                 | `Object`  | The data object returned from the request. Set to null if the request failed                                                                                                                                                                                                                                                |
| data.StatusCode      | `Integer` | The HTTP status code is in the 200 range for a successful request                                                                                                                                                                                                                                                           |
| data.FunctionError   | `String`  | If present, indicates that an error occurred during function execution. Options: <ul><li>`Handled` - The runtime caught an error thrown by the function and formatted it into a JSON document</li><li>`Unhandled` - The runtime didn't handle the error. For example, the function ran out of memory or timed out</li></ul> |
| data.LogResult       | `String`  | The last 4 KB of the execution log, which is base64 encoded                                                                                                                                                                                                                                                                 |
| data.Payload         | `Buffer`  | The response from the function, or an error object                                                                                                                                                                                                                                                                          |
| data.ExecutedVersion | `String`  | The version of the function that executed                                                                                                                                                                                                                                                                                   |

## STS

### new STS(options)

Creates a new STS object.

| Param                   | Type     | Description       |
| ----------------------- | -------- | ----------------- |
| options                 | `Object` |                   |
| options.accessKeyId     | `String` | AWS access key ID |
| options.secretAccessKey | `String` | AWS secret key    |
| options.region          | `String` | AWS region        |

#### sts.assumeRole(params, callback)

Request:

Callback

const Kinesis = require('../../lib/modules/kinesis');
const http = require('../../lib/helpers/http');

jest.mock('../../lib/helpers/http');

describe('Kinesis Module', () => {
  const options = {
    accessKeyId: '123',
    secretAccessKey: '123',
    region: 'ap-southeast-2',
  };
  const kinesis = new Kinesis(options);

  describe('putRecords', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should successfully invoke kinesis put records', () => {
      return new Promise((done) => {
        const response = {
          FailedRecordCount: 0,
          Records: [
            {
              SequenceNumber:
                '49543463076548007577105092703039560359975228518395019266',
              ShardId: 'shardId-000000000000',
            },
          ],
        };

        http.mockImplementation((_, callback) => {
          return callback(null, {
            statusCode: 200,
            body: response,
          });
        });

        const params = {
          Records: [
            {
              Data: 'dmFsdWU=',
              PartitionKey: 'partitionKey1',
            },
          ],
          StreamName: 'exampleStreamName',
        };
        kinesis.putRecords(params, (err, data) => {
          expect(err).toBeNull();
          expect(data).toMatchObject(response);

          expect(http).toHaveBeenCalledTimes(1);
          expect(http).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'POST',
              url: `https://kinesis.ap-southeast-2.amazonaws.com`,
              headers: {
                Authorization: expect.any(String),
                'Content-Type': 'application/x-amz-json-1.1',
                Host: 'kinesis.ap-southeast-2.amazonaws.com',
                'X-Amz-Date': expect.any(String),
                'X-Amz-Target': 'Kinesis_20131202.PutRecords',
              },
              body: JSON.stringify(params),
            }),
            expect.any(Function)
          );
          done();
        });
      });
    });

    test('should successfully invoke kinesis put records with session token', () => {
      return new Promise((done) => {
        const optionsWithSessionToken = {
          accessKeyId: '123',
          secretAccessKey: '123',
          sessionToken: '123',
          region: 'ap-southeast-2',
        };
        const kinesisWithSessionToken = new Kinesis(optionsWithSessionToken);

        const response = {
          FailedRecordCount: 0,
          Records: [
            {
              SequenceNumber:
                '49543463076548007577105092703039560359975228518395019266',
              ShardId: 'shardId-000000000000',
            },
          ],
        };

        http.mockImplementation((_, callback) => {
          return callback(null, {
            statusCode: 200,
            body: response,
          });
        });

        const params = {
          Records: [
            {
              Data: 'dmFsdWU=',
              PartitionKey: 'partitionKey1',
            },
          ],
          StreamName: 'exampleStreamName',
        };
        kinesisWithSessionToken.putRecords(params, (err, data) => {
          expect(err).toBeNull();
          expect(data).toMatchObject(response);

          expect(http).toHaveBeenCalledTimes(1);
          expect(http).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'POST',
              url: `https://kinesis.ap-southeast-2.amazonaws.com`,
              headers: {
                Authorization: expect.any(String),
                'Content-Type': 'application/x-amz-json-1.1',
                Host: 'kinesis.ap-southeast-2.amazonaws.com',
                'X-Amz-Date': expect.any(String),
                'X-Amz-Security-Token': '123',
                'X-Amz-Target': 'Kinesis_20131202.PutRecords',
              },
              body: JSON.stringify(params),
            }),
            expect.any(Function)
          );
          done();
        });
      });
    });

    test('should handle AWS returning HTTP error', () => {
      return new Promise((done) => {
        const response = {
          __type: 'ConfigException',
          message: 'The config was wrong',
        };

        http.mockImplementation((_, callback) => {
          return callback(null, {
            statusCode: 400,
            body: response,
          });
        });

        const params = {
          Records: [
            {
              Data: 'dmFsdWU=',
              PartitionKey: 'partitionKey1',
            },
          ],
          StreamName: 'exampleStreamName',
        };
        kinesis.putRecords(params, (err, data) => {
          expect(data).toBeNull();
          expect(err).toBeInstanceOf(Error);
          expect(err.code).toEqual('ConfigException');
          expect(err.message).toEqual('The config was wrong');
          done();
        });
      });
    });

    test('should handle unknown http errors', () => {
      return new Promise((done) => {
        http.mockImplementation((_, callback) => {
          return callback(null, {
            statusCode: 400,
          });
        });

        const params = {
          Records: [
            {
              Data: 'dmFsdWU=',
              PartitionKey: 'partitionKey1',
            },
          ],
          StreamName: 'exampleStreamName',
        };
        kinesis.putRecords(params, (err, data) => {
          expect(data).toBeNull();
          expect(err).toBeInstanceOf(Error);
          expect(err.code).toEqual('UnknownErrorException');
          expect(err.message).toEqual('An unknown error occurred');
          done();
        });
      });
    });

    test('should return all errors unchanged', () => {
      http.mockImplementation((_, callback) => {
        return callback(new Error('this is an error'), null);
      });

      const params = {
        Records: [
          {
            Data: 'dmFsdWU=',
            PartitionKey: 'partitionKey1',
          },
        ],
        StreamName: 'exampleStreamName',
      };
      kinesis.putRecords(params, (err, data) => {
        expect(data).toBeNull();
        expect(err.message).toEqual('this is an error');
      });
    });

    test('should throw required params error', () => {
      expect(() => {
        kinesis.putRecords();
      }).toThrow('Required parameters not included');

      expect(() => {
        kinesis.putRecords({
          Records: [],
        });
      }).toThrow('Required parameters not included');
    });
  });
});

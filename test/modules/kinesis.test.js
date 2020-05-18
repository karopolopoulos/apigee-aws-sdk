const Kinesis = require('../../lib/modules/kinesis');
const http = require('../../lib/helpers/http');

jest.mock('../../lib/helpers/http');

describe('STS Module', () => {
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

      http.mockImplementation(() => ({
        statusCode: 200,
        body: JSON.stringify(response),
      }));

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
              Host: 'kinesis.ap-southeast-2.amazonaws.com',
              'X-Amz-Date': expect.any(String),
              'X-Amz-Target': 'Kinesis_20131202.PutRecords',
            },
            body: JSON.stringify(params),
          })
        );
      });
    });

    test('should successfully invoke kinesis put records with session token', () => {
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

      http.mockImplementation(() => ({
        statusCode: 200,
        body: JSON.stringify(response),
      }));

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
              Host: 'kinesis.ap-southeast-2.amazonaws.com',
              'X-Amz-Date': expect.any(String),
              'X-Amz-Security-Token': '123',
              'X-Amz-Target': 'Kinesis_20131202.PutRecords',
            },
            body: JSON.stringify(params),
          })
        );
      });
    });

    test('should return all errors unchanged', () => {
      http.mockImplementation(() => {
        throw new Error('this is an error');
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

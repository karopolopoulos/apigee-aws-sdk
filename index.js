const Kinesis = require('./clients/kinesis');

const kinesis = new Kinesis({
  accessKeyId: 'AKIARHT2QDSXU6GUPEHX',
  secretAccessKey: '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',
  region: 'ap-southeast-2',
});

kinesis.putRecords(
  {
    Records: [
      {
        Data: 'dmFsdWU=',
        PartitionKey: 'partitionKey1',
      },
      {
        Data: 'dmFsdWUy',
        PartitionKey: 'partitionKey1',
      },
      {
        Data: 'dGhpcyBpcyB2YWx1ZTMgdGhpcyBpcyB2YWx1ZTMgdGhpcyBpcyB2YWx1ZTM=',
        PartitionKey: 'partitionKey3',
      },
    ],
    StreamName: 'exampleStreamName',
  },
  (err, data) => {
    console.log('err', err);
    console.log('data', data);
  }
);

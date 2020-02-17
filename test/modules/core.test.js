const Core = require('../../lib/modules/core');

describe('Core Module', () => {
  test('should return object with params', () => {
    const options = {
      accessKeyId: '123',
      secretAccessKey: '123',
      sessionToken: '123',
      region: 'ap-southeast-2'
    };

    const core = new Core(options);

    expect(core).toMatchObject({
      accessKeyId: '123',
      secretAccessKey: '123',
      sessionToken: '123',
      region: 'ap-southeast-2'
    });
  });
});

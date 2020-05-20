const Core = require('../../lib/modules/core');

describe('Core Module', () => {
  test('should return object with params', () => {
    const options = {
      accessKeyId: '123',
      secretAccessKey: '123',
      sessionToken: '123',
      region: 'ap-southeast-2',
    };

    const core = new Core(options);

    expect(core).toMatchObject({
      accessKeyId: '123',
      secretAccessKey: '123',
      sessionToken: '123',
      region: 'ap-southeast-2',
    });
  });

  test('region should default to us-east-1', () => {
    const options = {
      accessKeyId: '123',
      secretAccessKey: '123',
      sessionToken: '123',
    };

    const core = new Core(options);

    expect(core).toMatchObject({
      accessKeyId: '123',
      secretAccessKey: '123',
      sessionToken: '123',
      region: 'us-east-1',
    });
  });

  test('should throw required options error', () => {
    expect(() => {
      Core();
    }).toThrow('Required options not included');

    expect(() => {
      Core({ accessKeyId: '123' });
    }).toThrow('Required options not included');
  });
});

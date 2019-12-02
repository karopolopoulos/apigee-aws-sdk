const index = require('../lib');

describe('index.js unit test', () => {
  test('index file exports expected', () => {
    expect(index.Lambda).toBeDefined();
  });
});

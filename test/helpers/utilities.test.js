var utilities = require('../../lib/helpers/utilities');

describe('utilities Helper', () => {
  describe('generateQueryString', () => {
    test('expected query string is generated', () => {
      const queryParams = {
        param1: 'value-1',
        arrayStringParam: ['array-value-1', 'array-value-2'],
        arrayObjectParam: [
          { arrayObjectParam1: 'a' },
          { arrayObjectParam1: 'b', arrayObjectParam2: '1' }
        ]
      };

      const queryString = utilities.generateQueryString(queryParams);

      expect(queryString).toEqual(
        'param1=value-1&arrayStringParam.member.1=array-value-1&arrayStringParam.member.2=array-value-2&arrayObjectParam.member.1.arrayObjectParam1=a&arrayObjectParam.member.2.arrayObjectParam1=b&arrayObjectParam.member.2.arrayObjectParam2=1'
      );
    });
  });
});

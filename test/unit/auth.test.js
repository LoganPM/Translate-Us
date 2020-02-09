require('jest-extended');
require('jest-chain');
require('dotenv').config();

const { azureKey } = process.env;
const auth = require('../../modules/auth.js');

test('Change Auth Key in runtime', () => {
  process.env.azureKey = '';
  const reqHeader = {
    headers: {
      Authorization: '',
    },
  };

  return auth.getAuth(reqHeader).then((data) => {
    process.env.azureKey = azureKey;

    expect(data)
      .toBeObject()
      .toContainKey('error');
    expect(data.error)
      .toBeObject()
      .toContainEntry(['code', '401'])
      .toContainKey('message');
    expect(data.error.message)
      .toBeString()
      .not.toBeEmpty()
      .toStartWith('Access denied due to invalid subscription key');
  });
});

test('Happy path auth request', () => {
  const reqHeader = {
    headers: {
      Authorization: '',
    },
  };

  return auth.getAuth(reqHeader).then((data) => {
    expect(data)
      .toBeString()
      .not.toBeEmpty();
    expect(reqHeader)
      .toBeObject()
      .toContainKey('headers');
    expect(reqHeader.headers)
      .toBeObject()
      .toContainKey('Authorization');
    expect(reqHeader.headers.Authorization)
      .toBeString()
      .not.toBeEmpty()
      .toStartWith('Bearer');
  });
});

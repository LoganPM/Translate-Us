require('jest-extended');
require('jest-chain');
require('dotenv').config();
const db = require('../../modules/database.js');

let insertedDBId = '';

test('Happy path Insertion into DB', async () => {
  const data = await db.insertdb('user1', 'en', 'This is a test', 'fr', 'this is a teste', 'channel', 'receiver');
  expect(data)
    .toBeObject()
    .toContainKey('insertedId')
    .toContainKey('ops');
  expect(data.insertedId)
    .toBeObject();
  expect(data.ops[0])
    .toBeObject()
    .toContainEntries([['channel', 'channel'], ['originalLanguage', 'en'],
      ['originalText', 'This is a test'], ['receiver', 'receiver'], ['translationLanguage', 'fr'],
      ['translationText', 'this is a teste'], ['user', 'user1']])
    .toContainKey('dateTranslated');
  expect(data.ops[0].dateTranslated)
    .toBeString()
    .not.toBeEmpty();

  insertedDBId = data.insertedId;
});

test('Happy path Search in DB', async () => {
  const data = await db.findindb('user1', insertedDBId);
  expect(data)
    .toBeObject()
    .toContainAllKeys(['_id', 'user', 'originalLanguage', 'originalText', 'translationLanguage',
      'translationText', 'dateTranslated', 'channel', 'receiver']);
  expect(data.user)
    .toBeString()
    .not.toBeEmpty()
    .toEqualCaseInsensitive('user1');
  expect(data.originalLanguage)
    .toBeString()
    .not.toBeEmpty()
    .toEqualCaseInsensitive('en');
  expect(data.originalText)
    .toBeString()
    .not.toBeEmpty()
    .toEqualCaseInsensitive('this is a test');
  expect(data.translationLanguage)
    .toBeString()
    .not.toBeEmpty()
    .toEqualCaseInsensitive('fr');
  expect(data.translationText)
    .toBeString()
    .not.toBeEmpty()
    .toEqualCaseInsensitive('this is a teste');
  expect(data.channel)
    .toBeString()
    .not.toBeEmpty()
    .toEqualCaseInsensitive('channel');
  expect(data.receiver)
    .toBeString()
    .not.toBeEmpty()
    .toEqualCaseInsensitive('receiver');
  expect(data.dateTranslated)
    .toBeString()
    .not.toBeEmpty();
});

test('Search in DB, id not found', async () => {
  // Sending bad id
  const data = await db.findindb('user1', '123456789012345678abcdef');
  expect(data)
    .toBeObject()
    .toBeEmpty();
});

test('Search in DB, invalid id', async () => {
  // Sending invalid id
  const data = await db.findindb('user1', 'badId');
  expect(data)
    .toBeString()
    .not.toBeEmpty()
    .toEqualCaseInsensitive('Invalid ID,  must be a single String of 12 bytes or a string of 24 hex characters');
});

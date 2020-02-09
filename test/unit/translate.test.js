require('jest-extended');
require('jest-chain');
require('dotenv').config();

const translate = require('../../modules/translate.js');
const languages = require('../../languages.json');

/**
 * @param text hello
 * @param fromLang
 * @param toLang
 */
function generateTranslateObject(text, fromLang, toLang) {
  if (languages[fromLang.toLowerCase()] !== undefined) {
    fromLang = languages[fromLang.toLowerCase()];
  }
  if (languages[toLang.toLowerCase()] !== undefined) {
    toLang = languages[toLang.toLowerCase()];
  }

  return {
    method: 'POST',
    url: 'https://api.cognitive.microsofttranslator.com/translate',
    qs: { 'api-version': '3.0', from: fromLang, to: toLang },
    headers: {
      'Cache-control': 'no-cache',
      Authorization: '',
      'Content-type': 'application/json',
    },
    body: `[{"text": "${text}"}]`,
  };
}

test('Happy path translation', (done) => {
  const obj = generateTranslateObject('hello', 'english', 'spanish');
  translate.translate(obj, (data, error) => {
    expect(data)
      .toBeString()
      .toBe('Hola');
    expect(error).toBeNull();
    done();
  });
});

test('Wrong FROM language', (done) => {
  const obj = generateTranslateObject('hello', 'test', 'spanish');
  translate.translate(obj, (data, error) => {
    expect(data).toBeNull();
    expect(error)
      .toBeString()
      .toBe('The source language is not valid.');
    done();
  });
});

test('Missing TO language', (done) => {
  const obj = generateTranslateObject('hello', 'english', '');
  translate.translate(obj, (data, error) => {
    expect(data).toBeNull();
    expect(error)
      .toBeString()
      .toBe('The target language is not valid.');
    done();
  });
});

test('Missing FROM language, automatically detects language', (done) => {
  const obj = generateTranslateObject('hello', '', 'spanish');
  translate.translate(obj, (data, error) => {
    expect(data)
      .toBeString()
      .toBe('Hola');
    expect(error).toBeNull();
    done();
  });
});

test('Select translate to language does not match text entered', (done) => {
  const obj = generateTranslateObject('hello', 'spanish', 'french');
  translate.translate(obj, (data, error) => {
    expect(data)
      .toBeString()
      .toBe('Bonjour');
    expect(error).toBeNull();
    done();
  });
});

test('Automatically detects language, language used in text is same as TO language', (done) => {
  const obj = generateTranslateObject('bonjour', '', 'french');
  translate.translate(obj, (data, error) => {
    expect(data)
      .toBeString()
      .toBe('bonjour');
    expect(error).toBeNull();
    done();
  });
});

test('Automatically detects language, not clear language', (done) => {
  const obj = generateTranslateObject('nvjrekrenv', '', 'spanish');
  translate.translate(obj, (data, error) => {
    expect(data)
      .toBeString()
      .toBe('nvjrekrenv');
    expect(error).toBeNull();
    done();
  });
});

test('Automatically detects language, Text entered has multiple languages', (done) => {
  const obj = generateTranslateObject('hello hola', '', 'french');
  translate.translate(obj, (data, error) => {
    expect(data)
      .toBeString()
      .toBe('bonjour bonjour');
    expect(error).toBeNull();
    done();
  });
});

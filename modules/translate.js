const request = require('request');
const auth = require('./auth');
/**
 * Function to perform translation request and send text to user
 *
 * @param translateObject
 * @param callback
 */
module.exports.translate = function translate(translateObject, callback) {
  let translatedText = '';

  const promise = auth.getAuth(translateObject);
  promise.then(() => {
    request(translateObject, (error, response, body) => {
      try {
        const jsonObj = JSON.parse(body);
        if (Object.keys(jsonObj)[0] === 'error') {
          return callback(null, jsonObj.error.message);
        }

        if (Object.keys(jsonObj[0])[0] === 'detectedLanguage') {
          translatedText = jsonObj[0].translations[0].text;
          return callback(translatedText, null);
        }


        translatedText = jsonObj[0].translations[0].text;
        return callback(translatedText, null);
      } catch (err) {
        return callback(null, `failed to parse response: ${body}`);
      }
    });
  }, (err) => {
    console.log(err);
  });
};

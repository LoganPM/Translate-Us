const request = require('request');

/**
 * Function to get Azure Authorization token
 *
 * @param translateObject
 * @returns
 */
module.exports.getAuth = function getAuth(translateObject) {
  let authToken = '';
  const { azureKey } = process.env;
  const authUrl = 'https://eastus.api.cognitive.microsoft.com/sts/v1.0/issuetoken';

  // Request options
  const optionsAuth = {
    method: 'POST',
    url: authUrl,
    headers: {
      'Ocp-Apim-Subscription-Key': azureKey,
      'Content-type': 'application/json',
    },
    json: true,
  };
  
  
  return new Promise((resolve, reject) => {
    request(optionsAuth, (err, resp, body) => {
      if (!err) {
        authToken = body.toString();
        translateObject.headers.Authorization = `Bearer ${authToken}`;
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
};

/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const axios = require('axios');
const db = require('../modules/database.js');
const translate = require('../modules/translate.js');
const dialogJSON = require('./dialog.json');

module.exports = function main(controller) {
  /**
   * Handles the slash_command ('/translate') used to activate the bot
   */
  controller.on('slash_command', async (bot, message) => {
    // user passes arguments with command
    if (message.text !== '') {
      // let user know, no arguments needed
      await bot.replyPrivate(message, '--- translate-us help menu ---\n\tWelcome to translate-us!\n\tThis bot helps you translate your slack messages to better communicate with your scrum team all over the world!\n\tusage: /translate (then fill out all fields in the dialog box)');
    } else {
      // user typed in no arguments, bring up dialog box
      // headers to send request to open dialog
      const auth = `Bearer ${process.env.botToken}`;

      const config = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          authorization: auth,
        },
      };

      const dialogPayload = {
        token: process.env.botToken,
        trigger_id: message.trigger_id,
        dialog: dialogJSON,
      };

      // POST request to open the dialog in slack
      axios.post('https://slack.com/api/dialog.open', dialogPayload, config)
        .then((response) => {
          console.log('\n--- RESPONSE ---');
          console.log(response.data);
        });
    }
  });

  // *** Greeting any user that says 'hi' ***

  /**
   * @param {{submission:string}} dialog submission object
   * @param {{toLang:string}} language to translate
   * @param {{fromLang:string}} from language
   * @param {{textToTranslate:string}} submission text to translate
   * */
  controller.on('dialog_submission', (bot, message) => {
    const toLang = message.submission.toLang;
    let fromLang = message.submission.fromLang;
    const textToTranslate = message.submission.textToTranslate;
    if (fromLang === 'auto') {
      fromLang = '';
    }
    const optionsTranslate = {
      method: 'POST',
      url: 'https://api.cognitive.microsofttranslator.com/translate',
      qs: { 'api-version': '3.0', from: fromLang, to: toLang },
      headers: {
        'Cache-control': 'no-cache',
        Authorization: '',
        'Content-type': 'application/json',
      },
      body: `[{"text": "${textToTranslate}" }]`,
    };

    translate.translate(optionsTranslate, async (data, error) => {
      if (error) {
        try {
          await bot.replyPrivate(message, error);
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const insertResult = await db.insertdb('user', fromLang, textToTranslate, toLang, data, 'channel', 'receiver');
          const tempString = `Translation: ${data}`;

          const confirmJson = {
            choice: 'YES',
            dbID: insertResult.insertedId,
            value: data,
          };
          const denyJson = {
            choice: 'NO',
          };

          await bot.replyPrivate(message, {
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: tempString,
                },
              },
              {
                type: 'divider',
              },
              {
                type: 'actions',
                elements: [
                  {
                    type: 'button',
                    text: {
                      type: 'plain_text',
                      text: 'Confirm',
                      emoji: true,
                    },
                    value: JSON.stringify(confirmJson),
                  },
                  {
                    type: 'button',
                    text: {
                      type: 'plain_text',
                      text: 'Cancel',
                      emoji: true,
                    },
                    value: JSON.stringify(denyJson),
                  },
                ],
              },
            ],
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  });
  
  controller.on('block_actions', async (bot, message) => {
    const userChoice = JSON.parse(message.incoming_message.text);
    if (userChoice.choice === 'YES') { // no to discard
      const originalText = {
        choice: 'OM',
        dbID: userChoice.dbID,
      };
      console.log(message.incoming_message.text);
      await bot.replyPrivate(message, 'Message has been sent');
      await bot.say({
        blocks: 
        [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*<@${message.user}> Says:* ${userChoice.value}`,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'See Original Message',
                  emoji: true,
                },
                value: JSON.stringify(originalText),
              },
            ],
          },
        ],
        channel: message.channel, // channel Id for #slack_integration
      });
    } else if (userChoice.choice === 'OM') {
      try {
        const dbID = JSON.parse(message.incoming_message.channelData.actions[0].value).dbID;
        const v = await db.findindb('user', dbID);
        await bot.replyEphemeral(message, `*The Translated Message:*  
          ${v.translationText}\n*The Original Message:* ${v.originalText}`); 
      } catch (e) {
        console.log(e);
      }
    } else {
      await bot.replyPrivate(message, {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Translation has been discarded.',
            },
          },
        ],
      });
    }
  });
};

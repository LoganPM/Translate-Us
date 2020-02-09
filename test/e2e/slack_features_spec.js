const mocha = require('mocha');

const { describe } = mocha;
const { it } = mocha;
const { assert } = require('chai');
const { BotMock, SlackApiMock } = require('botkit-mock');
const { SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware } = require('botbuilder-adapter-slack');
const fileBeingTested = require('../../features/slack_features');

// Load process.env values from .env file
require('dotenv').config();

/**
 * @param timeout
 */
async function setTimeoutAsync(timeout = 100) {
  return new Promise((r) => setTimeout(r, timeout));
}

describe('slack_features file', () => {
  const initController = () => {
    const adapter = new SlackAdapter({
      clientSigningSecret: process.env.clientSigningSecret,
      botToken: process.env.botToken,
      debug: true,
    });
    adapter.use(new SlackEventMiddleware());
    adapter.use(new SlackMessageTypeMiddleware());

    this.controller = new BotMock({
      adapter,
    });

    SlackApiMock.bindMockApi(this.controller);
    fileBeingTested(this.controller);
  };

  beforeEach(() => {
    this.userInfo = {
      slackId: 'user123',
      channel: 'test',
    };
  });

  describe('wrong slashcommand input', () => {
    beforeEach(() => {
      initController();
    });

    it('given help argument, should reply with the default help message', async () => {
      const text = 'help';
      const response_url = 'response_url/public';
      await this.controller.usersInput([
        {
          type: 'slash_command',
          user: this.userInfo.slackId, // user required for each direct message
          channel: this.userInfo.channel, // user channel required for direct message
          messages: [
            {
              text,
              isAssertion: true,
              response_url,
            },
          ],
        },
      ]);

      await setTimeoutAsync(1000);
      const reply = this.controller.apiLogByKey[response_url][0];
      assert.strictEqual(reply.text, '--- translate-us help menu ---\n\tWelcome to '
        + 'translate-us!\n\tThis bot helps you translate your slack messages to better communicate '
        + 'with your scrum team all over the world!\n\tusage: /translate (then fill out all fields '
        + 'in the dialog box)');
    });

    it('given invalid argument, should reply with the default help message', async () => {
      const text = 'what do I do...';
      const response_url = 'response_url/public';
      await this.controller.usersInput([
        {
          type: 'slash_command',
          user: this.userInfo.slackId, // user required for each direct message
          channel: this.userInfo.channel, // user channel required for direct message
          messages: [
            {
              text,
              isAssertion: true,
              response_url,
            },
          ],
        },
      ]);

      await setTimeoutAsync(1000);
      const reply = this.controller.apiLogByKey[response_url][0];
      assert.strictEqual(reply.text, '--- translate-us help menu ---\n\tWelcome to '
        + 'translate-us!\n\tThis bot helps you translate your slack messages to better communicate '
        + 'with your scrum team all over the world!\n\tusage: /translate (then fill out all fields '
        + 'in the dialog box)');
    });
  });
});
//
//     it('should reply with the input invalid message', async () => {
//       const text = 'invalid_text_here';
//       const response_url = 'response_url/public';
//       await this.controller.usersInput([
//         {
//           type: 'slash_command',
//           user: this.userInfo.slackId, // user required for each direct message
//           channel: this.userInfo.channel, // user channel required for direct message
//           messages: [
//             {
//               text,
//               isAssertion: true,
//               response_url,
//             },
//           ],
//         },
//       ]);
//
//       const reply = this.controller.apiLogByKey[response_url][0];
//       assert.strictEqual(reply.text, 'Uh oh! Your command format is invalid. Please try again.
//       \n\tusage: /translate text:\"hola\" from:\"Spanish\" to:\"English\"');
//     });
//
//     it('should reply with the English translation of "Hola" which is "Hello"', async () => {
//       const text = 'text:"hola" from:"Spanish" to:"English"';
//       const response_url = 'response_url/public';
//       await this.controller.usersInput([
//         {
//           type: 'slash_command',
//           user: this.userInfo.slackId, // user required for each direct message
//           channel: this.userInfo.channel, // user channel required for direct message
//           messages: [
//             {
//               text,
//               isAssertion: true,
//               response_url,
//             },
//           ],
//         },
//       ]);
//       await setTimeoutAsync(1000);
//       const reply = this.controller.apiLogByKey[response_url][0];
//       assert.strictEqual(reply.text, 'Hello');
//     });
//
//     it('should reply that the TO language is not recognized', async () => {
//       const text = 'text:"hola" from:"Spanish" to:"Navi"';
//       const response_url = 'response_url/public';
//       await this.controller.usersInput([
//         {
//           type: 'slash_command',
//           user: this.userInfo.slackId, // user required for each direct message
//           channel: this.userInfo.channel, // user channel required for direct message
//           messages: [
//             {
//               text,
//               isAssertion: true,
//               response_url,
//             },
//           ],
//         },
//       ]);
//       await setTimeoutAsync(1000);
//       const reply = this.controller.apiLogByKey[response_url][0];
//       assert.strictEqual(reply.text, 'Uh oh! we dont recognize your TO language,
//       please try again.\n');
//     });
//
//     it('should reply that the FROM language is not recognized', async () => {
//       const text = 'text:"hola" from:"Gunganese" to:"English"';
//       const response_url = 'response_url/public';
//       await this.controller.usersInput([
//         {
//           type: 'slash_command',
//           user: this.userInfo.slackId, // user required for each direct message
//           channel: this.userInfo.channel, // user channel required for direct message
//           messages: [
//             {
//               text,
//               isAssertion: true,
//               response_url,
//             },
//           ],
//         },
//       ]);
//       await setTimeoutAsync(1000);
//       const reply = this.controller.apiLogByKey[response_url][0];
//       assert.strictEqual(reply.text, 'Uh oh! we dont recognize your FROM language, please try
//       again\n');
//     });
//   });
// });
//
// // describe('slash command general-slack', () => {
// //     beforeEach(() => {
// //         this.userInfo = {
// //             slackId: 'UP9EJCHT3',
// //             channel: 'bots',
// //         };
// //
// //         this.response_url = 'https://hooks.slack.com/services/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';
// //
// //         this.sequence = [
// //             {
// //                 type: 'slash_command',
// //                 user: this.userInfo.slackId, //user required for each direct message
// //                 channel: this.userInfo.channel, // user channel required for direct message
// //                 messages: [
// //                     {
// //                         text: 'text',
// //                         isAssertion: true,
// //                         command: '',
// //                         response_url: this.response_url
// //                     }
// //                 ]
// //             }
// //         ];
// //         const adapter = new SlackAdapter({
// //             // parameters used to secure webhook endpoint
// //             clientSigningSecret: process.env.clientSigningSecret,
// //             botToken: process.env.botToken,
// //             debug: true
// //         });
// //
// //         adapter.use(new SlackEventMiddleware());
// //         adapter.use(new SlackMessageTypeMiddleware());
// //
// //         this.controller = new BotMock({
// //             adapter: adapter,
// //             disable_webserver: true
// //         });
// //
// //         SlackApiMock.bindMockApi(this.controller);
// //         fileBeingTested(this.controller);
// //     });
// //
// //     describe('Test Happy Path Translation of English -> French', () => {
// //         it('should output "Salut tout le monde! comment allez-vous aujourd\'hui?"',
// async () => {
// //             this.sequence[0].messages[0].command = '/translate';
// //             this.sequence[0].messages[0].text = ' text:"Hello world! How are you doing today?"
// from:"English" to:"French"';
// //             const message = await this.controller.usersInput(this.sequence);
// //             console.log("0 " + util.inspect(this.sequence[0], false, null, true /* enable
// colors */));
// //             console.log("1 " + util.inspect(message, false, null, true /* enable colors */));
// //             console.log("3 " + this.response_url);
// //             const reply = this.controller.apiLogByKey[this.response_url][0];
// //             console.log("2 " + reply);
// //             assert.strictEqual(reply.text, 'Salut tout le monde! comment allez-vous
// aujourd\'hui?"');
// //             console.log(reply.channelData.response_type);
// //             assert.strictEqual(reply.channelData.response_type, 'in_channel', 'should be
// public message');
// //         });
// //     });
//
//     describe('help menu', () => {
//       it('should return `help message` if user types `help`', async () => {
//         this.sequence[0].messages[0].command = '/translate';
//         this.sequence[0].messages[0].text = 'help';
//         await this.controller.usersInput(this.sequence);
//         const reply = this.controller.apiLogByKey[this.response_url][0];
//         assert.contains(reply.text, '--- translate-us help menu ---');
//         assert.strictEqual(reply.channelData.response_type, 'ephemeral', 'should be private
//         message');
//       });
//     });
//
// // describe('reply with timeout', () => {
// //     it('should wait for the command result given a timout', async () => {
// //         this.sequence[0].messages[0].command = '/private_long_running';
// //         this.sequence[0].messages[0].waitAfter = 300;
// //
// //         const msg = await this.controller.usersInput(this.sequence);
// //         assert.strictEqual(msg.text, 'Timeout reply');
// //     });
//   });
// })

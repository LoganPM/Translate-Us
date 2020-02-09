// / <reference types="Cypress" />
/* eslint no-undef: off */
/* eslint jest/valid-expect: off */
context('Actions', () => {
  before(() => {
    cy.visit('https://teambotris.slack.com');
    cy.url().then((url) => {
      console.log(url);
      // If slack loaded, Log In
      if (url.indexOf('https://app.slack.com/client/TP2KFPRR9') === -1) {
        cy.get('#email').type('Hvanderm@uoguelph.ca');
        cy.get('.checkbox').click();
        cy.get('#password').type('MyTestPassword{enter}');
        cy.wait(5000);
      }
    });
  });
  beforeEach(() => {
    // Reload the page
    cy.visit('https://teambotris.slack.com/messages/CQ84G5QDP');
    cy.url().should('include', 'https://app.slack.com/client/TP2KFPRR9/CQ84G5QDP');
  });
  it('Verify Slash Command Opens Dialog', () => {
    cy.get('.p-message_input_field').type('/translateautomatedtest {enter}');
    cy.get('[data-qa=dialog]').should('exist');
    cy.screenshot();
    cy.wait(500);
  });
  it('Verify Dialog Translates "Hello" to "Bonjour"', () => {
    // Get id of current last message
    cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().invoke('attr', 'id')
      .as('lastMsgId');
    cy.get('@lastMsgId').then(($div) => {
      cy.log($div);
    });
    // Open dialog
    cy.get('.p-message_input_field').type('/translateautomatedtest {enter}');
    cy.wait(500);
    cy.screenshot();
    cy.get('[data-qa=dialog]').find('[data-name=fromLang]').find('input').click({ force: true });
    cy.get('[data-qa=select_option_en]').click();
    cy.get('[data-qa=dialog]').find('[data-name=toLang]').find('input').click({ force: true });
    cy.get('[data-qa=select_option_fr]').click();
    cy.get('[name=textToTranslate]').type('Hello');
    cy.screenshot();
    cy.get('[data-qa=dialog_go]').click();
    cy.wait(5000);
    // Get id of last message, compare it to previous id (to check it is a new message)
    cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().invoke('attr', 'id')
      .then((id) => {
        cy.log(id);
        cy.get('@lastMsgId').should((oldId) => {
          expect(oldId).not.to.eq(id);
        });
        // Check that the message is translated correctly
        cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().find('[data-qa=bk_section_block]')
          .contains('span', 'Bonjour');
      });
    cy.screenshot();
  });
  it('Verify Automatic From Language Detection Works to Translates "Hello" to "Bonjour"', () => {
    // Get id of current last message
    cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().invoke('attr', 'id')
      .as('lastMsgId');
    cy.get('@lastMsgId').then(($div) => {
      cy.log($div);
    });
    // Open dialog
    cy.get('.p-message_input_field').type('/translateautomatedtest {enter}');
    cy.wait(500);
    cy.screenshot();
    cy.get('[data-qa=dialog]').find('[data-name=toLang]').find('input').click({ force: true });
    cy.get('[data-qa=select_option_fr]').click();
    cy.get('[name=textToTranslate]').type('Hello');
    cy.screenshot();
    cy.get('[data-qa=dialog_go]').click();
    cy.wait(5000);
    // Get id of last message, compare it to previous id (to check it is a new message)
    cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().invoke('attr', 'id')
      .then((id) => {
        cy.log(id);
        cy.get('@lastMsgId').should((oldId) => {
          expect(oldId).not.to.eq(id);
        });
        // Check that the message is translated correctly
        cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().find('[data-qa=bk_section_block]')
          .contains('span', 'Bonjour');
      });
    cy.screenshot();
  });
  it('Verify Confirm Button Creates New Message', () => {
    // Get id of current last message
    cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().invoke('attr', 'id')
      .as('lastMsgId');
    cy.get('@lastMsgId').then(($div) => {
      cy.log($div);
    });
    // Open dialog
    cy.get('.p-message_input_field').type('/translateautomatedtest {enter}');
    cy.wait(500);
    cy.screenshot();
    cy.get('[data-qa=dialog]').find('[data-name=fromLang]').find('input').click({ force: true });
    cy.get('[data-qa=select_option_en]').click();
    cy.get('[data-qa=dialog]').find('[data-name=toLang]').find('input').click({ force: true });
    cy.get('[data-qa=select_option_fr]').click();
    cy.get('[name=textToTranslate]').type('Hello');
    cy.screenshot();
    cy.get('[data-qa=dialog_go]').click();
    cy.wait(5000);
    // Get id of last message, compare it to previous id (to check it is a new message)
    cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().invoke('attr', 'id')
      .as('confirmId')
      .then((id) => {
        cy.log(id);
        cy.get('@lastMsgId').should((oldId) => {
          expect(oldId).not.to.eq(id);
        });
        // Check that the message is translated correctly
        cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().find('[data-qa=bk_actions_block]')
          .find('[data-qa=bk_actions_block_action]')
          .first()
          .click();
        cy.wait(5000);
        cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().invoke('attr', 'id')
          .then((messageId) => {
            cy.get('@confirmId').should((oldId) => {
              expect(oldId).not.to.eq(messageId);
            });
            // Check that the message is translated correctly
            cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().find('[data-qa=bk_section_block]')
              .contains('span', 'Bonjour');
          });
      });
    cy.screenshot();
  });
  it('Verify View Original Message Button Shows Original', () => {
    // Get id of current last message
    cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().invoke('attr', 'id')
      .as('lastMsgId');
    cy.get('@lastMsgId').then(($div) => {
      cy.log($div);
    });
    // Open dialog
    cy.get('.p-message_input_field').type('/translateautomatedtest {enter}');
    cy.wait(500);
    cy.screenshot();
    cy.get('[data-qa=dialog]').find('[data-name=fromLang]').find('input').click({ force: true });
    cy.get('[data-qa=select_option_en]').click();
    cy.get('[data-qa=dialog]').find('[data-name=toLang]').find('input').click({ force: true });
    cy.get('[data-qa=select_option_fr]').click();
    cy.get('[name=textToTranslate]').type('Hello');
    cy.screenshot();
    cy.get('[data-qa=dialog_go]').click();
    cy.wait(5000);
    // Get id of last message, compare it to previous id (to check it is a new message)
    cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().invoke('attr', 'id')
      .as('confirmId')
      .then((id) => {
        cy.log(id);
        cy.get('@lastMsgId').should((oldId) => {
          expect(oldId).not.to.eq(id);
        });
        // Check that the message is translated correctly
        cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().find('[data-qa=bk_actions_block]')
          .find('[data-qa=bk_actions_block_action]')
          .first()
          .click();
        cy.wait(5000);
        cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().find('[data-qa=bk_actions_block]')
          .find('[data-qa=bk_actions_block_action]')
          .first()
          .click();
        cy.wait(5000);
        // Check that the original message is displayed
        cy.get('[data-qa=slack_kit_list]').find('[class=c-virtual_list__item]').last().find('[data-qa=message_content]')
          .contains('span', 'The Original Message: Hello');
      });
    cy.screenshot();
  });
});

import {
  formField,
  expectPath,
  visitPage,
} from '../../support/site';

describe('Lost Pet Search packages and FAQ', () => {
  it('shows current packages, hours, and discount', () => {
    visitPage('/lost-pet-search');

    cy.get('main').should(($main) => {
      const text = $main.text().replace(/\s+/g, ' ');

      expect(text).to.match(
        /FOCUSED SEARCH.*\$300.*UP TO 3 HOURS/i
      );
      expect(text).to.match(
        /EXTENDED SEARCH.*\$500.*UP TO 6 HOURS/i
      );
      expect(text).to.match(
        /COMPREHENSIVE SEARCH.*\$750.*UP TO 10 HOURS/i
      );
      expect(text).to.match(
        /10% OFF LOST PET SEARCH PACKAGES/i
      );
      expect(text).not.to.contain('$495');
    });
  });

  it('opens and closes the no-guarantee FAQ answer', () => {
  visitPage('/lost-pet-search');

  const question = /Can you guarantee you'll find my pet\?/i;
  const button = () => cy.contains('main button', question);

  button().should('have.attr', 'aria-expanded', 'false');

  button().click();
  button().should('have.attr', 'aria-expanded', 'true');

  button().invoke('attr', 'aria-controls').then((id) => {
    expect(id, 'FAQ answer ID')
      .to.be.a('string')
      .and.not.be.empty;

    cy.get(`[id="${id}"]`)
      .should('be.visible')
      .and('contain.text', 'cannot be guaranteed');

    // Wait for active animations on the answer and its accordion item.
    cy.get(`[id="${id}"]`).should(($answer) => {
      const answer = $answer[0];
      const item =
        answer.closest('.accordion-item') || answer.parentElement;

      expect(item, 'accordion container').not.to.eq(null);

      const running = item!
        .getAnimations({ subtree: true })
        .filter((animation) => animation.playState === 'running');

      expect(running, 'unfinished accordion animations')
        .to.have.length(0);
    });

    button().click();
    button().should('have.attr', 'aria-expanded', 'false');

    cy.get(`[id="${id}"]`).should('not.be.visible');
  });
});

  it('request call to action opens the search form', () => {
    visitPage('/lost-pet-search');

    const requestLink = () =>
      cy.contains(
        'main a',
        /^\s*REQUEST\s+A\s+PET\s+SEARCH\b/i
      );

    requestLink()
      .should('be.visible')
      .invoke('attr', 'href')
      .then((href) => {
        expectPath(href, '/pet-search-request');
      });

    requestLink().click();

    cy.location('pathname')
      .should('eq', '/pet-search-request');

    cy.contains(
      'main h1',
      /^\s*REQUEST\s+A\s+PET\s+SEARCH\s*$/i
    ).should('be.visible');

    cy.get('main form').should('be.visible');
  });
});

describe('Pet request form structure (no submission)', () => {
  beforeEach(() => {
    visitPage('/pet-search-request');
  });

  it('shows key customer and search fields', () => {
    const labels = [
      /^First Name/i,
      /^Last Name/i,
      /^Email Address/i,
      /^Species \/ Breed/i,
      /^Color \/ Identifying/i,
      /^Last Known Location/i,
      /^Date Last Seen/i,
    ];

    for (const label of labels) {
      formField(label)
        .should('be.visible')
        .and('be.enabled');
    }

    cy.contains('main form', 'Mobile Phone')
      .should('be.visible');

    cy.get('main form input[id^="phone-"]')
      .should('be.visible')
      .and('be.enabled');

    // Inspect the submit control without clicking or submitting.
    // Squarespace may render it outside the form element.
    cy.get('main')
      .find('button, input[type="submit"], [role="button"]')
      .filter((_index, element) => {
        const text =
          element.tagName === 'INPUT'
            ? (element as HTMLInputElement).value
            : element.textContent || '';

        return /SEND\s+PET\s+SEARCH\s+REQUEST/i.test(text);
      })
      .should('have.length', 1)
      .and('be.visible');
  });

  it('package options match the published prices and can be selected', () => {
    formField(/^Requested Search Package/i)
      .should('have.attr', 'required');

    formField(/^Requested Search Package/i)
      .find('option')
      .then(($options) => {
        const text = $options
          .toArray()
          .map((option) => option.textContent || '')
          .join(' | ');

        expect(text).to.match(
          /Focused Search.*3 Hours.*\$300/
        );
        expect(text).to.match(
          /Extended Search.*6 Hours.*2 Deployments.*\$500/
        );
        expect(text).to.match(
          /Comprehensive Search.*10 Hours.*3 Deployments.*\$750/
        );
        expect(text).not.to.contain('$495');
      });

    formField(/^Requested Search Package/i)
      .find('option')
      .contains(/Focused Search/)
      .invoke('val')
      .then((value) => {
        formField(/^Requested Search Package/i)
          .select(String(value))
          .should('have.value', value);
      });
  });

  it('shows contact choices and both acknowledgment checkboxes', () => {
    formField(/^Preferred Contact Method/i)
      .find('option')
      .then(($options) => {
        const choices = $options
          .toArray()
          .map((option) => option.textContent?.trim());

        expect(choices).to.include.members([
          'Phone',
          'Text',
          'Email',
        ]);
      });

    const acknowledgments = [
      /^I understand that submitting this request/i,
      /^I understand that drone-assisted search services/i,
    ];

    for (const label of acknowledgments) {
      formField(label)
        .should('have.attr', 'type', 'checkbox')
        .and('not.be.checked');
    }

    cy.get('main').should(
      'contain.text',
      'does not confirm service availability'
    );
  });
});
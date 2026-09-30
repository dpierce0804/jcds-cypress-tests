import { expectPath, visitPage } from '../../support/site';

const nav = [
  ['Home', '/'],
  ['Services', '/services'],
  ['Lost Pet Search', '/lost-pet-search'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

function linkText(name: string) {
  return new RegExp(`^\\s*${name.split(' ').join('\\s+')}\\s*$`, 'i');
}

describe('JCDS visitor navigation', () => {
  for (const [name, path] of nav) {
    it(`desktop navigation opens ${name}`, () => {
      cy.viewport(1440, 1000);
      visitPage('/');

      const selector = 'header nav.header-nav-list a:visible';
      const text = linkText(name);

      cy.contains(selector, text)
        .should('be.visible')
        .invoke('attr', 'href')
        .then((href) => expectPath(href, path));

      cy.contains(selector, text).click();

      cy.location('pathname').should('eq', path);
      cy.get('main#page').should('be.visible');
    });
  }

  it('quote call to action opens Contact', () => {
    cy.viewport(1440, 1000);
    visitPage('/');

    cy.contains('main a', /^\s*REQUEST\s+A\s+QUOTE\b/i)
      .should('be.visible')
      .invoke('attr', 'href')
      .then((href) => expectPath(href, '/contact'));

    cy.contains('main a', /^\s*REQUEST\s+A\s+QUOTE\b/i).click();

    cy.location('pathname').should('eq', '/contact');
    cy.contains('main h2', /Get in Touch/i).should('be.visible');
  });

  it('mobile menu opens Lost Pet Search', () => {
    cy.viewport('iphone-x');
    visitPage('/');

    cy.get('header button[data-test="header-burger"]:visible')
      .should('have.length', 1)
      .click();

    cy.contains(
      'header nav.header-menu-nav-list a:visible',
      /Lost\s+Pet\s+Search/i
    ).click();

    cy.location('pathname').should('eq', '/lost-pet-search');
    cy.contains('main h1', /HELP SEARCH FOR YOUR MISSING PET/i)
      .should('be.visible');
  });
});
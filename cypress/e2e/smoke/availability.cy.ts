import { pages, visitPage } from '../../support/site';

describe('JCDS critical page smoke checks', () => {
  for (const page of pages) {
    it(`${page.path} returns HTML and displays its key heading`, () => {
      cy.request(page.path).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.contain('text/html');
      });
      visitPage(page.path);
      cy.location('protocol').should('eq', 'https:');
      cy.location('pathname').should('eq', page.path);
      cy.title().should('match', /Jaxen Creek Drone Services/i);
      // Contact currently uses an h2, and About has multiple h1 elements.
      cy.contains('main h1, main h2', page.heading).should('be.visible');
    });
  }
});

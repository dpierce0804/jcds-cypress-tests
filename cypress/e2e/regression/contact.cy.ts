import { expectPhone, visitPage } from '../../support/site';
describe('Contact options', () => {
  it('offers the correct phone and email destinations', () => {
    visitPage('/contact');
    cy.get('main a[href^="tel:"]').should('be.visible').invoke('attr', 'href').then(expectPhone);
    cy.get('main a[href^="mailto:"]').should('be.visible')
      .and('have.attr', 'href', 'mailto:service@jaxencreekdroneservices.com');
    cy.get('main').should('contain.text', 'Baker City');
    // Do not click tel/mailto links: that would launch an external application.
  });
});

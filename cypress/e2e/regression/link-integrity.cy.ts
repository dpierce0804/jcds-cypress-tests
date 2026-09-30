import { expectPath, expectPhone, visitPage } from '../../support/site';

// These checks intentionally expose issues observed on September 30, 2026.
// Fix the Squarespace links; do not change expectations to match broken targets.
describe('Customer link integrity', () => {
  it('homepage Explore Services button points to Services', () => {
    visitPage('/');
    cy.contains('main a', /^\s*EXPLORE\s+SERVICES\b/i).invoke('attr', 'href')
      .then(href => expectPath(href, '/services'));
  });

  it('homepage thermal button targets the existing thermal section', () => {
    visitPage('/');
    cy.contains('main a', /^\s*EXPLORE\s+THERMAL\b/i).invoke('attr', 'href')
      .then(href => expectPath(href, '/services', '#thermal-imaging'));
  });

  it('footer phone number has a working telephone destination', () => {
    visitPage('/');
    cy.contains('footer a', /\(541\) 406-0359/).invoke('attr', 'href').then(expectPhone);
  });
});

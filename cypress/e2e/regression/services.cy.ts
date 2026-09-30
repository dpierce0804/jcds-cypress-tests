import { visitPage } from '../../support/site';
const anchors = [
  'agricultural-services', 'inspection-services', 'thermal-imaging',
  'aerial-media', 'mapping-services', 'special-services',
];
describe('JCDS service sections', () => {
  for (const anchor of anchors) {
    it(`Services link reaches #${anchor}`, () => {
      visitPage('/services');
      cy.get(`main a[href="/services#${anchor}"]`).first().click();
      cy.location('hash').should('eq', `#${anchor}`);
      cy.get(`[id="${anchor}"]`).scrollIntoView().should('be.visible');
    });
  }
});

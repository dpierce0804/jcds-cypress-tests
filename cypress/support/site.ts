export const pages = [
  { path: '/', heading: /PROFESSIONAL AGRICULTURAL DRONE & GEOSPATIAL SOLUTIONS/i },
  { path: '/services', heading: /PROFESSIONAL DRONE SOLUTIONS FOR EASTERN OREGON/i },
  { path: '/lost-pet-search', heading: /HELP SEARCH FOR YOUR MISSING PET FROM ABOVE/i },
  { path: '/about', heading: /LOCAL KNOWLEDGE. ADVANCED AERIAL TECHNOLOGY./i },
  { path: '/contact', heading: /Get in Touch/i },
  { path: '/pet-search-request', heading: /^REQUEST A PET SEARCH$/i },
];

export function dismissCookies() {
  cy.get('body').then(($body) => {
    const decline = $body.find('button').filter((_i, el) =>
      /^decline$/i.test(el.textContent?.trim() || '') && Cypress.$(el).is(':visible'));
    if (decline.length) cy.wrap(decline.first()).click();
  });
}

export function visitPage(path: string) {
  cy.visit(path);
  cy.get('main#page').should('be.visible');
  dismissCookies();
}

export function formField(label: RegExp) {
  return cy.get('main form label').filter((_i, el) => label.test(el.textContent || ''))
    .should('have.length', 1).then(($label) => {
      const id = $label.attr('for');
      if (id) return cy.get(`[id="${id}"]`);
      // Squarespace wraps radio/checkbox controls inside their label.
      return cy.wrap($label).find('input, select, textarea').should('have.length', 1);
    });
}

export function expectPath(href: string | undefined, path: string, hash = '') {
  expect(href, 'link destination').to.be.a('string').and.not.be.empty;
  const url = new URL(href!, Cypress.config('baseUrl')!);
  expect(url.origin).to.eq(new URL(Cypress.config('baseUrl')!).origin);
  expect(url.pathname.replace(/\/$/, '') || '/').to.eq(path);
  expect(url.hash).to.eq(hash);
}

export function expectPhone(href: string | undefined) {
  expect(href).to.match(/^tel:/i);
  expect(href!.slice(4).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '')).to.eq('5414060359');
}

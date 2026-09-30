describe('Application smoke checks', () => {
  it('serves a healthy API', () => {
    cy.request('/api/health').then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.status).to.eq('ok');
    });
  });
  it('loads the task interface', () => {
    cy.visit('/');
    cy.get('[data-cy=heading]').should('have.text', 'Task Board');
    cy.get('[data-cy=task-input]').should('be.visible');
    cy.get('[data-cy=task-list] li').should('have.length', 0);
  });
});

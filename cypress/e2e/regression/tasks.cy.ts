describe('Task workflow', () => {
  beforeEach(() => cy.visit('/'));
  it('adds, completes, and deletes a task', () => {
    cy.get('[data-cy=task-input]').type('Review scheduled test results{enter}');
    cy.get('[data-cy=task-list] li').should('have.length', 1)
      .and('contain.text', 'Review scheduled test results');
    cy.get('[data-cy=task-toggle]').check().should('be.checked');
    cy.get('[data-cy=task-text]').should('have.class', 'complete');
    cy.get('[data-cy=task-delete]').click();
    cy.get('[data-cy=task-list] li').should('not.exist');
  });
  it('rejects a blank task', () => {
    cy.get('[data-cy=task-input]').type('   ');
    cy.get('[data-cy=task-add]').click();
    cy.get('[data-cy=task-list] li').should('not.exist');
    cy.get('[data-cy=message]').should('have.text', 'Enter a task first.');
  });
  it('preserves multiple tasks independently', () => {
    cy.get('[data-cy=task-input]').type('First task{enter}');
    cy.get('[data-cy=task-input]').type('Second task{enter}');
    cy.get('[data-cy=task-list] li').should('have.length', 2);
    cy.get('[data-cy=task-toggle]').first().check();
    cy.get('[data-cy=task-toggle]').last().should('not.be.checked');
    cy.get('[data-cy=task-delete]').first().click();
    cy.get('[data-cy=task-list] li').should('have.length', 1).and('contain.text', 'Second task');
  });
});

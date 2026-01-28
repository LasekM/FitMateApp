describe('Login Flow', () => {
  it('should display the login page', () => {
    cy.visit('/login');
    cy.contains('Login to FitMate').should('be.visible');
    cy.get('#userNameOrEmail').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });
});

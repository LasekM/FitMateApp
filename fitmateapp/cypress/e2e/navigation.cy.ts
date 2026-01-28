describe('Navigation Flow', () => {
  it('should navigate to register page from login', () => {
    cy.visit('/login');
    cy.contains('Sign up').click();
    cy.url().should('include', '/register');
    cy.contains('Create your FitMate account').should('be.visible');
  });
});

/// <reference types="cypress" />

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('#userNameOrEmail').type(email);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  // Wait for redirect to dashboard or check for a dashboard element
  cy.url().should('not.include', '/login');
});

Cypress.Commands.add('register', (email, password, username) => {
  cy.visit('/register');
  cy.get('#email').type(email);
  cy.get('#userName').type(username);
  cy.get('#fullName').type(username); // Using username as Full Name
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/register');
});

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      login(email: string, password: string): Chainable<void>;
      register(email: string, password: string, username: string): Chainable<void>;
    }
  }
}


export {}; // Make this file a module



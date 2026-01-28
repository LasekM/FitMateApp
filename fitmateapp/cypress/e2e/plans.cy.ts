describe('Plans Management', () => {
  beforeEach(() => {
    const uniqueId = Date.now();
    const email = `test${uniqueId}@example.com`;
    const password = 'StrongPass123!#';
    const username = `user${uniqueId}`;

    cy.register(email, password, username);
    cy.login(email, password); 
  });

  const timestamp = Date.now();
  const planName = `Cypress Plan ${timestamp}`;

  it('should create, edit, and delete a plan', () => {
    // --- Create Plan ---
    cy.visit('/plans');
    cy.contains('Add new').click();
    
    cy.get('input[placeholder="Plan name"]').type(planName);
    cy.get('input[placeholder*="Type"]').type('Strength');
    cy.get('textarea[placeholder="Short description"]').type('Created by Cypress');
    
    // Add Exercise
    cy.contains('+ Add Exercise').click();
    // Assuming the first exercise input is the name
    cy.get('input[value=""]').first().type('Bench Press'); 
    
    cy.contains('Save Plan').click();
    
    // Verify creation
    cy.contains(planName).should('be.visible');
    cy.contains('Created by Cypress').should('be.visible');

    // --- Edit Plan ---
    // Find the plan card and click edit
    cy.contains(planName).parents('div').filter((i, el) => el.className.includes('bg-gray-800')).find('button').contains('Edit').click();
    
    cy.get('textarea[placeholder="Short description"]').clear().type('Updated by Cypress');
    cy.contains('Save Changes').click();
    
    // Verify edit
    cy.contains('Updated by Cypress').should('be.visible');

    // --- Delete Plan ---
    cy.contains(planName).parents('div').filter((i, el) => el.className.includes('bg-gray-800')).find('button').contains('Delete').click();
    
    // Confirm delete toast
    // Find the text "Are you sure", go to its immediate parent container, and find the button
    cy.contains('Are you sure')
      .parent() 
      .find('button.bg-red-600')
      .should('be.visible')
      .click();
    
    // Verify deletion
    cy.contains(planName).should('not.exist');
  });
});

describe('Body Measurements', () => {
  beforeEach(() => {
    const uniqueId = Date.now();
    const email = `measure${uniqueId}@example.com`;
    const password = 'StrongPass123!#';
    const username = `measure${uniqueId}`;

    cy.register(email, password, username);
    cy.login(email, password);
  });

  it('should add new measurements with detailed metrics and verify history', () => {
    cy.visit('/profile');
    
    // Ensure "Body Metrics" tab is active
    cy.contains('button', 'Body Metrics').should('have.class', 'text-green-500');

    const height = '182';
    const initialWeight = '85.0';

    // --- 1. Add Initial Measurement ---
    cy.log('Adding first measurement with details');
    cy.contains('label', 'Weight (kg) *').next('input').clear().type(initialWeight);
    cy.contains('label', 'Height (cm) *').next('input').clear().type(height);
    
    // Add extended metrics
    cy.contains('label', 'Chest').next('input').clear().type('105');
    cy.contains('label', 'Waist').next('input').clear().type('90');
    cy.contains('label', 'Hips').next('input').clear().type('100');
    cy.contains('label', 'Biceps').next('input').clear().type('38');
    cy.contains('label', 'Thighs').next('input').clear().type('60');
    cy.contains('label', 'Body Fat %').next('input').clear().type('20');
    
    cy.contains('button', 'Save Measurement').click();
    
    // Verify toast
    cy.contains('Measurement saved successfully!').should('be.visible');

    // Verify first entry in History table
    cy.get('table tbody tr').first().scrollIntoView().within(() => {
      // Note: weight might be displayed as '85' if it's an integer, or '85.5' if float.
      // initialWeight is '85.0', so it might be rendered as '85'
      cy.contains(parseFloat(initialWeight).toString()).should('be.visible'); 
      cy.contains('105').should('be.visible'); // Chest
      cy.contains('90').should('be.visible');  // Waist
      cy.contains('100').should('be.visible'); // Hips
      cy.contains('20').should('be.visible');  // Fat %
      // Note: Thighs might not be visible in the first view if columns are hidden roughly, 
      // but checking existence in row is good. 
      // If table is responsive, some columns might be hidden. Assuming desktop view or check "Thighs" header exists.
    });

    // --- 2. Delete First Measurement (to allow new one if backend restricts per-day) ---
    cy.log('Deleting first measurement');
    cy.get('button[title="Delete"]').first().click();
    
    // Handle window.confirm
    cy.on('window:confirm', () => true);
    
    cy.contains('Measurement deleted.').should('be.visible');

    // --- 3. Add Second Measurement (Different Params) ---
    cy.wait(1000); 
    cy.log('Adding second measurement with updated details');
    
    // Wait for the form/state to settle (though React update should contain the latest data now)
    // Verify Height is pre-filled (User rq: "wzrostu nie zmieniaj")
    cy.contains('label', 'Height (cm) *').next('input').should('have.value', height);

    const newWeight = '84';
    cy.contains('label', 'Weight (kg) *').next('input').clear().type(newWeight);
    
    // Change detailed metrics
    cy.contains('label', 'Chest').next('input').clear().type('106'); // Gains
    cy.contains('label', 'Waist').next('input').clear().type('89');  // Cut
    cy.contains('label', 'Hips').next('input').clear().type('101');
    cy.contains('label', 'Biceps').next('input').clear().type('39');
    cy.contains('label', 'Thighs').next('input').clear().type('62');

    cy.contains('button', 'Save Measurement').click();
    
    // Verify toast again (or existing one disappears and new one shows)
    cy.contains('Measurement saved successfully!').should('be.visible');

    // Verify new entry is now the top one
    cy.get('table tbody tr').first().scrollIntoView().within(() => {
      cy.contains(parseFloat(newWeight).toString()).should('be.visible');
      cy.contains('106').should('be.visible');
      cy.contains('89').should('be.visible');
      cy.contains('101').should('be.visible'); // Hips
      cy.contains('39').should('be.visible');
      cy.contains('62').should('be.visible');  // Thighs
    });
  });
});

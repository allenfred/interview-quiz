describe('Login Test', () => {
  it('should login successfully with valid credentials', () => {
    // Given the user is on the login page
    cy.visit('http://localhost:3000/entrance');

    // Intercept the login request and return fake data
    cy.intercept('POST', 'http://localhost:3100/api/users/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
      },
    }).as('loginRequest');

    // Intercept the whoAmI request and return fake user data
    cy.intercept('GET', 'http://localhost:3100/api/whoAmI', {
      statusCode: 200,
      body: {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        phone: '12345678910',
        role: 'guest',
      },
    }).as('whoAmIRequest');

    // When the user enters valid credentials and submits the form
    cy.get('input[name="contactInfo"]').type('alice.johnson@example.com');
    cy.get('input[name="password"]').type('123456');
    cy.get('button').contains('Guest Entrance').click();

    // Then the user should be redirected to the reservation list page
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.wait('@whoAmIRequest').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/reservationList');
    // cy.contains('Reservations').should('be.visible');
  });

  it('should show an error message with invalid credentials', () => {
    // Given the user is on the login page
    cy.visit('http://localhost:3000/entrance');

    // Intercept the login request and return an error
    cy.intercept('POST', 'http://localhost:3100/api/users/login', {
      statusCode: 401,
      body: {
        message: 'Invalid contactInfo or password.',
      },
    }).as('loginRequest');

    // When the user enters invalid credentials and submits the form
    cy.get('input[name="contactInfo"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button').contains('Guest Entrance').click();

    // Then the user should see an error message
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    cy.contains('Request failed with status code 401').should('be.visible');
  });
});

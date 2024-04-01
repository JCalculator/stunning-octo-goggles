const BASE_REQUEST_TIME = 10000;
describe('Feed', () => {
  beforeEach(() => {
    cy.intercept('/feed').as('feedRequest')
    cy.visit('http://host.docker.internal:5173')
  })

  it('should render the language select element', () => {
    cy.get('#language').should('exist');
  });

  it('should render the date input element', () => {
    cy.get('#date').should('exist');
  });
  
  it('should render the navigation', () => {
    cy.wait(BASE_REQUEST_TIME);
    cy.get('#navigation', { timeout: BASE_REQUEST_TIME }).should('exist');
  });

  it('should change the selected language', () => {
    const newLanguage = 'es';

    cy.get('#language').select(newLanguage);
    cy.get('#language').should('have.value', newLanguage);
  });

  it('should change the selected date', () => {
    const newDate = '2022-01-01';

    cy.get('#date').clear().type(newDate);
    cy.get('#date').should('have.value', newDate);
  });

  it('shows feed cards', () => {
    cy.get('.article-card', { timeout: BASE_REQUEST_TIME }).should('exist');
  });

  it('shows feed cards after selecting language and date', () => {
    const newLanguage = 'es';
    const newDate = '2022-01-01';

    cy.get('#language').select(newLanguage);
    cy.get('#date').clear().type(newDate);

    cy.get('.article-card', { timeout: BASE_REQUEST_TIME * 3 }).should('exist');
  });

  describe('When clicking a card read more button', () => {
    it('should be able to navigate to the article page in a new tab', () => {
      cy.get('.article-card a:first', { timeout: BASE_REQUEST_TIME }).should('have.attr', 'target', '_blank');
    });
  });

  describe('After scrolling to the bottom', () => {
    it('shows new feed cards', () => {
      cy.get('.article-card').then(($articles) => {
        const initialCount = $articles.length;
  
        cy.get('.article-card').last().scrollIntoView();
  
        cy.get('.article-card').should('have.length.greaterThan', initialCount);
      });
    });
    it('updates the feed navigation', () => {
      cy.get('.article-card').then(() => {

        cy.get('.article-card').last().scrollIntoView();
        cy.wait(5000);
        cy.get('#navigation div').should('have.length', 2);
      });
    });
  });
  
});
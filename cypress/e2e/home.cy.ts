describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
    cy.ai('I see "Kitchen Sink"')
  })
})

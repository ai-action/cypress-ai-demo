describe('template spec', () => {
  it('passes', () => {
    cy.ai('go to example.cypress.io and see heading "Kitchen Sink"');
    cy.ai('click on "Commands" nav dropdown and click on link "Actions"');
    cy.ai('find label "Coupon Code" and type "HALFOFF" in text field');
    cy.ai('click button "Submit"');
  });
});

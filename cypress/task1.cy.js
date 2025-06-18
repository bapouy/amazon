describe("template spec", () => {
  beforeEach(() => {
    // Wait 10 seconds to allow manual captcha completion
    cy.visit("https://amazon.com");
    cy.wait(10000);
  });

  it("Validate navigation elements on top menu and customer service page search", () => {
    // Wait for the navigation container to be visible
    cy.get("#nav-xshop-container").should("be.visible");

    // Define the expected navigation items in order
    const expectedNavItems = [
      "Today's Deals",
      "Registry",
      "Prime Video",
      "Gift Cards",
      "Customer Service",
      "Sell",
    ];

    // Get all navigation list items
    cy.get("#nav-xshop-container .nav-li").should(
      "have.length.at.least",
      expectedNavItems.length
    );

    // Validate each navigation item exists, is in correct order, and is clickable
    expectedNavItems.forEach((itemText, index) => {
      cy.get("#nav-xshop-container .nav-li")
        .eq(index)
        .within(() => {
          // Check that the element contains the expected text
          cy.get(".nav-a").should("contain.text", itemText);

          // Verify the link is clickable (has href attribute and is not disabled)
          cy.get(".nav-a").should("have.attr", "href");
          cy.get(".nav-a").should("not.have.attr", "disabled");
          cy.get(".nav-a").should("be.visible");

          // Verify the link structure is correct
          cy.get(".nav-a").should("have.class", "nav-a");
        });
    });

    // Additional validation: ensure all links are actually clickable
    cy.get("#nav-xshop-container .nav-a").each(($link) => {
      // Check that the link has a valid href
      cy.wrap($link).should("have.attr", "href").and("not.be.empty");

      // Check that the link is visible and not disabled
      cy.wrap($link).should("be.visible");
      cy.wrap($link).should("not.be.disabled");
    });

    // Find and click on the Customer Service link
    cy.get("#nav-xshop-container .nav-a")
      .contains("Customer Service")
      .should("be.visible")
      .click();

    // Verify we navigated to the customer service page
    cy.url().should("include", "nav_cs_customerservice");

    // Type "where is My Stuff" in the search box and press enter
    cy.get("#twotabsearchtextbox")
      .should("be.visible")
      .clear()
      .type("where is My Stuff{enter}");

    // Click on "Your Amazon orders" element
    cy.contains("Your Amazon orders").should("be.visible").click();

    // Validate that we are redirected to login page
    cy.url().should("include", "signin");
  });
});

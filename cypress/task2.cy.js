describe("template spec", () => {
  beforeEach(() => {
    // Set viewport to 1920x1080
    cy.viewport(1920, 1080); //

    // Handle uncaught exceptions on amazon.com
    Cypress.on("uncaught:exception", (err, runnable) => {
      // Returning false here prevents Cypress from failing the test
      return false;
    });

    // Wait 15 seconds to allow manual captcha completion
    cy.visit("https://amazon.com");
    cy.wait(15000);
    addToCartFromSearch(
      "Bostitch Personal Electric Pencil Sharpener, Powerful Stall-Free Motor, High Capacity Shavings Tray, Blue (EPS4-BLUE)",
      1
    );
  });

  afterEach(() => {
    //clear cart
    cy.get("[data-feature-id='item-delete-button']")
      .first()
      .should("be.visible")
      .click();
    cy.get("[data-feature-id='item-delete-button']")
      .first()
      .should("be.visible")
      .click();
  });

  // Function to add item to cart by searching for it
  function addToCartFromSearch(searchTermm, productCount) {
    // Wait for the search box to be visible
    cy.get("#twotabsearchtextbox")
      .should("be.visible")
      .clear()
      .type(searchTermm + "{enter}");

    // Wait for search results to load
    cy.get("[data-component-type='s-search-results']").should("be.visible");

    // Click add to cart on the first product found
    cy.get("#a-autoid-1-announce").should("be.visible").click();

    // Verify item was added to cart
    cy.get(
      ".a-section.a-spacing-none.ewc-item-content.ewc-item-update-content"
    ).should("have.length", productCount);
  }

  it("Validate cart", () => {
    // Wait for the navigation container to be visible
    cy.get("#nav-xshop-container").should("be.visible");

    cy.visit(
      "https://www.amazon.com/Scissors-iBayam-Crafting-Scrapbooking-Knitting/dp/B07H3QKN2Z"
    );
    cy.get("[alt='Yellow, Grey, Blue']").eq(1).click({ force: true }); //may be a better selector, the force is because is covered by another element
    cy.get("#inline-twister-expanded-dimension-text-color_name", {
      timeout: 30000,
    }) // timeout can be configured globaly, noticed that sometimes it takes longger to appear
      .should("be.visible")
      .should("have.text", "Yellow, Grey, Blue");

    cy.get("#add-to-cart-button").should("be.visible").click(); // click on add to cart button
    // Verify item was added to cart
    cy.get(
      ".a-section.a-spacing-none.ewc-item-content.ewc-item-update-content"
    ).should("have.length", 2); // verify item was added to cart (2 items in the cart)
    cy.get("#sw-gtc").should("be.visible").click(); // click on got to cart button
    cy.get("[data-a-selector='increment']").eq(1).click(); // click on increment button on the second item on the cart
    cy.get("[data-a-selector='increment']").eq(1).click();
  });
});

/// <reference types="Cypress" />

//Load front page
describe("Front page loads", function () {
    it("Loads successfully", function () {
      cy.visit("http://localhost:19006/");
    });
  });
  
  //Check if list of songs exists
describe("List of songs should exist", function () {
  it("Show a list of songs", function () {
    cy.get(".r-paddingVertical-1w50u8q").should("exist");
  });
});

//Check if sorting works
describe("Sorting should work", function () {
  it("Sort list", function () {
    cy.get(':nth-child(3) > :nth-child(2)').click();
    cy.wait(1000);

    cy.get(':nth-child(3) > :nth-child(2)').then((titles) => {
      const unsortedItems = titles
        .map((index, html) => Cypress.$(html).text())
        .get();
      const sortedItems = unsortedItems.slice().sort();
      expect(unsortedItems, "Items are sorted").to.deep.equal(sortedItems);
    });
  });



  //remove sort
  it("Remove sort", function () {
    cy.get(':nth-child(1) > :nth-child(3) > :nth-child(1)').click();
  });
});

// Check if adding song works
describe("Add song", function () {
  it("User can add song to database", function () {
    cy.get('[style="align-self: center; background-color: rgb(0, 70, 67); border-color: rgba(0, 0, 0, 0); border-radius: 0px; border-style: solid; border-width: 0px; box-shadow: rgba(0, 0, 0, 0.24) 0px 0.75px 1.5px; min-width: 64px; width: 50%; opacity: 0.7;"] > .css-cursor-18t94o4 > .css-view-1dbjc4n').click();
    cy.get(':nth-child(2) > .r-paddingBottom-1mdbw0j > .css-textinput-11aywtz').type("Best Friend");
    cy.get(':nth-child(3) > .r-paddingBottom-1mdbw0j > .css-textinput-11aywtz').type("2.35");
    cy.get(':nth-child(4) > .r-paddingBottom-1mdbw0j > .css-textinput-11aywtz').type("Best Friend");
    cy.get(':nth-child(5) > .r-paddingBottom-1mdbw0j > .css-textinput-11aywtz').type("2021");
    cy.get(':nth-child(6) > .r-paddingBottom-1mdbw0j > .css-textinput-11aywtz').type("Saweetie");
    cy.get(':nth-child(7) > .r-paddingBottom-1mdbw0j > .css-textinput-11aywtz').type("Doja Cat");
    cy.focused().click();
    cy.contains("SUBMIT").click();
  });
});

//Check if search works
describe("Search", function () {
  it("Accepts input", function () {
    cy.get('[style="background-color: rgb(0, 70, 67); border-color: rgba(0, 0, 0, 0); border-radius: 0px; border-style: solid; border-width: 0px; box-shadow: rgba(0, 0, 0, 0.24) 0px 0.75px 1.5px; min-width: 64px; width: 50%; opacity: 0.7;"] > .css-cursor-18t94o4 > .css-view-1dbjc4n').click()
    cy.get('.css-textinput-11aywtz')
      .type("Saweetie")
      .should("have.value", "Saweetie");

    cy.wait(2000);

    cy.get('.r-paddingVertical-1w50u8q').each((element) => {
      cy.get(element).should("contain", "Saweetie");
    });
  });
});

//View and delete song just made
describe("View and delete song", function () {
  it("View song", function () {
    cy.get('.r-paddingVertical-1w50u8q > :nth-child(1)').click();
  });

  it("Delete song", function () {
    cy.get('.r-marginBottom-d0pm55 > :nth-child(1) > #animatedComponent > .css-cursor-18t94o4 > .css-view-1dbjc4n').click();
  });
});
 
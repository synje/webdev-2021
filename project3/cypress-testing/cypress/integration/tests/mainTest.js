/// <reference types="Cypress" />

//Load front page
describe("Front page loads", function () {
  it("Loads successfully", function () {
    cy.visit("http://it2810-30.idi.ntnu.no/prosjekt3/");
  });
});

//Check if list of songs exists
describe("List of songs should exist", function () {
  it("Show a list of songs", function () {
    cy.get("[data-cy=listItem]").should("exist");
  });
});

//Check if sorting works
describe("Sorting should work", function () {
  it("Sort list", function () {
    cy.get("[data-cy=sortbyTitle]").click();
    cy.wait(1000);

    cy.get("[data-cy=songTitle]").then((titles) => {
      const unsortedItems = titles
        .map((index, html) => Cypress.$(html).text())
        .get();
      const sortedItems = unsortedItems.slice().sort();
      expect(unsortedItems, "Items are sorted").to.deep.equal(sortedItems);
    });
  });

  //remove sort
  it("Remove sort", function () {
    cy.get("[data-cy=removeSort]").click();
  });
});

//Check if show more works
describe("Show more", function () {
  it("Loads 10 more songs after clicking view more", function () {
    cy.get("[data-cy=showMore]").click();
    cy.wait(1000);
    cy.scrollTo("bottom");
    cy.get("[data-cy=listItem]").should("have.length", 20);
  });
});

//Check if show less works
describe("Show less", function () {
  it("Loads 10 less songs after clicking view less", function () {
    cy.get("[data-cy=showLess]").click();
    cy.wait(1000);
    cy.get("[data-cy=listItem]").should("have.length", 10);
  });
});

//Check if adding song works
describe("Add song", function () {
  it("User can add song to database", function () {
    cy.get("[data-cy=title]").type("Best Friend");
    cy.get("[data-cy=duration]").type("2.35");
    cy.get("[data-cy=album]").type("Best Friend");
    cy.get("[data-cy=year]").type("2021");
    cy.get("[data-cy=artist1]").type("Saweetie");
    cy.get("[data-cy=artist2]").type("Doja Cat");
    cy.focused().click();
    cy.contains("ADD SONG").click();
  });
});

//Check if search works
describe("Search", function () {
  it("Accepts input", function () {
    cy.get("[data-cy=searchBar]")
      .type("Saweetie")
      .should("have.value", "Saweetie");
    cy.get("[data-cy=searchButton]").click();

    cy.wait(2000);

    cy.get("[data-cy=listItem]").each((element) => {
      cy.get(element).should("contain", "Saweetie");
    });
  });
});

//View and delete song just made
describe("View and delete song", function () {
  it("View song", function () {
    cy.get("[data-cy=songView]").first().click();
  });

  it("Delete song", function () {
    cy.get("[data-cy=delete]").click();
  });
});

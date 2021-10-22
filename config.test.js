const { expect } = require("chai");
const {
  DEFAULT_IMAGES_PATH,
  DEFAULT_METADATA_PATH,
  IMAGES_BASE_URI,
  TOKEN_NAME_PREFIX,
  TOKEN_DESCRIPTION,
  TOTAL_TOKENS,
  ORDERED_TRAITS_LIST: traitsList,
} = require("./config");

describe("Constants validation:", () => {
  it("DEFAULT_IMAGES_PATH should be a string", () => {
    expect(DEFAULT_IMAGES_PATH).to.be.a("string");
  });

  it("DEFAULT_METADATA_PATH should be a string", () => {
    expect(DEFAULT_METADATA_PATH).to.be.a("string");
  });

  it("IMAGES_BASE_URI should be a valid URI string", () => {
    expect(IMAGES_BASE_URI).to.be.a("string");
    const regex = new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    );
    expect(regex.test(IMAGES_BASE_URI)).to.be.true;
  });

  it("TOKEN_NAME_PREFIX should be a string", () => {
    expect(TOKEN_NAME_PREFIX).to.be.a("string");
  });

  it("TOKEN_DESCRIPTION (if present) should be a string", () => {
    if (TOKEN_DESCRIPTION) {
      expect(TOKEN_DESCRIPTION).to.be.a("string");
    }
  });

  it("TOTAL_TOKENS should be an integer of at least 1", () => {
    expect(TOTAL_TOKENS % 1).to.equal(0);
    expect(TOTAL_TOKENS).to.be.a("number").of.at.least(1);
  });
});

describe("Traits list validation:", () => {
  it("should be an array", () => {
    expect(traitsList).to.be.an("array");
  });

  it("each trait's display (if present) should be one of: 'number', 'boost_percentage', 'boost_number', 'date'", () => {
    traitsList.forEach(
      ({ display }) =>
        display &&
        expect(display).to.be.oneOf([
          "number",
          "boost_percentage",
          "boost_number",
          "date",
        ])
    );
  });

  it("each trait's type (if present) should be a string", () => {
    traitsList.forEach(({ type }) => type && expect(type).to.be.a("string"));
  });

  it("each trait's type string should be unique", () => {
    const uniqueTypes = new Set();
    traitsList.forEach(({ type }) => {
      if (type) {
        expect(uniqueTypes.has(type)).to.be.false;
        uniqueTypes.add(type);
      }
    });
  });

  it("each trait should include an options array", () => {
    traitsList.forEach(({ options }) => expect(options).to.be.an("array"));
  });

  it("each option should include a weight integer of at least 1", () => {
    traitsList.forEach(({ options }) =>
      options.forEach(({ weight }) => {
        expect(weight % 1).to.equal(0);
        expect(weight).to.be.a("number").of.at.least(1);
      })
    );
  });

  it("each option's image (if present) should be a string", () => {
    traitsList.forEach(({ options }) =>
      options.forEach(({ image }) => image && expect(image).to.be.a("string"))
    );
  });

  it("each option's value (if present) should be a number or a string", () => {
    traitsList.forEach(({ options }) =>
      options.forEach(
        ({ value }) =>
          value &&
          expect(value).to.satisfy((v) =>
            ["string", "number"].includes(typeof v)
          )
      )
    );
  });

  it("each trait with a defined display string should also have a type", () => {
    traitsList.forEach(
      ({ display, type }) => display && expect(type).to.be.a("string")
    );
  });

  it("each trait with a defined display string should have options with number values", () => {
    traitsList.forEach(
      ({ display, options }) =>
        display &&
        options.forEach(({ value }) => value && expect(value).to.be.a("number"))
    );
  });

  it("each trait with display equal to 'date' should have only integer values", () => {
    traitsList.forEach(
      ({ display, options }) =>
        display === "date" &&
        options.forEach(({ value }) => {
          expect(value % 1).to.equal(0);
          expect(value).to.be.a("number");
        })
    );
  });

  it("each value from traits without a type should be unique", () => {
    const uniqueValues = new Set();
    traitsList.forEach(
      ({ type, options }) =>
        !type &&
        options.forEach(({ value }) => {
          if (value) {
            expect(uniqueValues.has(value)).to.be.false;
            uniqueValues.add(value);
          }
        })
    );
  });

  it("each option's allowed condition (if present) should be an array of strings", () => {
    traitsList.forEach(({ options }) =>
      options.forEach(({ allowed }) => {
        if (allowed) {
          expect(allowed).to.be.an("array");
          allowed.forEach((item) => expect(item).to.be.an("string"));
        }
      })
    );
  });

  it("each allowed condition item should match an option value from a previous trait", () => {
    let allPreviousValues = [];
    traitsList.forEach(({ options }) => {
      const traitValues = [];
      options.forEach(({ allowed, value }) => {
        if (allowed) {
          allowed.forEach((item) => expect(allPreviousValues).to.include(item));
        }
        if (value) traitValues.push(value);
      });
      allPreviousValues = allPreviousValues.concat(traitValues);
    });
  });

  it("each option's forbidden condition (if present) should be an array of strings", () => {
    traitsList.forEach(({ options }) =>
      options.forEach(({ forbidden }) => {
        if (forbidden) {
          expect(forbidden).to.be.an("array");
          forbidden.forEach((item) => expect(item).to.be.an("string"));
        }
      })
    );
  });

  it("each forbidden condition item should match an option value from a previous trait", () => {
    let allPreviousValues = [];
    traitsList.forEach(({ options }) => {
      const traitValues = [];
      options.forEach(({ forbidden, value }) => {
        if (forbidden) {
          forbidden.forEach((item) =>
            expect(allPreviousValues).to.include(item)
          );
        }
        if (value) traitValues.push(value);
      });
      allPreviousValues = allPreviousValues.concat(traitValues);
    });
  });

  it("no allowed condition item should be equal to a forbidden condition item in the same option", () => {
    traitsList.forEach(({ options }) => {
      options.forEach(({ allowed, forbidden }) => {
        if (allowed && forbidden) {
          forbidden.forEach((item) => expect(allowed).to.not.include(item));
        }
      });
    });
  });

  it("each trait's 'ignore' setting (if present) should be boolean", () => {
    traitsList.forEach(
      ({ ignore }) => ignore && expect(ignore).to.be.a("boolean")
    );
  });
});

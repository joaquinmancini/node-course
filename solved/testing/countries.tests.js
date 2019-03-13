const countryInfo = require("../country-info"),
  countries = require("./countries")(countryInfo),
  expect = require("chai").expect,
  sinon = require("sinon");

describe("countries tests", () => {

  after(() => {
    // Code to be executed after ALL tests (just once)
    // Used to clean up all tests results (possible leftovers or garbage)
    sinon.restore();
  });

  context("unit", () => {

    const data = {
      code: "FQ",
      name: "Fiqus"
    };
  
    describe("success cases", () => {

      it("getByCode() should call countryInfo.getCountryInfo() with given country code and return data", () => {
        const stubGetCountryInfo = sinon.stub(countryInfo, "getCountryInfo").callsFake((code, cb) => {
          stubGetCountryInfo.restore();
          expect(code).to.eql(data.code);
          cb(null, data);
        });

        return countries.getByCode(data.code).then((country) => {
          expect(stubGetCountryInfo.calledOnce).to.eql(true);
          expect(country).to.eql(data);
        });
      });

      it("getByCode() should return null when countryInfo.getCountryInfo() doesn't return a valid response", () => {
        const stubGetCountryInfo = sinon.stub(countryInfo, "getCountryInfo").callsFake((code, cb) => {
          stubGetCountryInfo.restore();
          expect(code).to.eql(data.code);
          cb(null, "whatever");
        });

        return countries.getByCode(data.code).then((country) => {
          expect(stubGetCountryInfo.calledOnce).to.eql(true);
          expect(country).to.eql(null);
        });
      });

      it("getByName() should call countryInfo.getCountryInfoByName() with given country name and return data", () => {
        const stubGetCountryInfoByName = sinon.stub(countryInfo, "getCountryInfoByName").callsFake((name, cb) => {
          stubGetCountryInfoByName.restore();
          expect(name).to.eql(data.name);
          cb(null, data);
        });

        return countries.getByName(data.name).then((country) => {
          expect(stubGetCountryInfoByName.calledOnce).to.eql(true);
          expect(country).to.eql(data);
        });
      });

      it("getByName() should return null when countryInfo.getCountryInfoByName() doesn't return a valid response", () => {
        const stubGetCountryInfoByName = sinon.stub(countryInfo, "getCountryInfoByName").callsFake((name, cb) => {
          stubGetCountryInfoByName.restore();
          expect(name).to.eql(data.name);
          cb(null, "whatever");
        });

        return countries.getByName(data.name).then((country) => {
          expect(stubGetCountryInfoByName.calledOnce).to.eql(true);
          expect(country).to.eql(null);
        });
      });

    });

    describe("error cases", () => {
      
      const error = new Error("This is an error!");

      it("getByCode() should reject with the error given by countryInfo.getCountryInfo()", () => {
        const stubGetCountryInfo = sinon.stub(countryInfo, "getCountryInfo").callsFake((code, cb) => {
          stubGetCountryInfo.restore();
          expect(code).to.eql(data.code);
          cb(error);
        });

        return countries.getByCode(data.code)
          .then(() => {
            throw new Error("This promise should be rejected!");
          })
          .catch((err) => {
            expect(stubGetCountryInfo.calledOnce).to.eql(true);
            expect(err).to.eql(error);
          });
      });

      it("getByName() should reject with the error given by countryInfo.getCountryInfoByName()", () => {
        const stubGetCountryInfoByName = sinon.stub(countryInfo, "getCountryInfoByName").callsFake((name, cb) => {
          stubGetCountryInfoByName.restore();
          expect(name).to.eql(data.name);
          cb(error);
        });

        return countries.getByName(data.name)
          .then(() => {
            throw new Error("This promise should be rejected!");
          })
          .catch((err) => {
            expect(stubGetCountryInfoByName.calledOnce).to.eql(true);
            expect(err).to.eql(error);
          });
      });

    });

  });

  context("integration", () => {

    it("getByCode() should get the name of the country 'AR'", () => {
      return countries.getByCode("AR").then((country) => {
        expect(country.name).to.eql("Argentina");
      });
    });

    it("getByCode() should return null when a country is not found", () => {
      return countries.getByCode("FQ").then((country) => {
        expect(country).to.eql(null);
      });
    });

    it("getByName() should get the code of the country 'Argentina'", () => {
      return countries.getByName("Argentina").then((country) => {
        expect(country.code).to.eql("AR");
      });
    });

    it("getByName() should return null when a country is not found", () => {
      return countries.getByName("Fiqus").then((country) => {
        expect(country).to.eql(null);
      });
    });

  });

});

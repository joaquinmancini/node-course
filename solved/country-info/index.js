const fs = require("fs");
let jsonData = null;

function loadCountries(cb) { // eslint-disable-line consistent-return
  if (jsonData) {
    return cb(null, jsonData);
  }

  fs.readFile(`${__dirname}/countries.json`, "utf8", (err, data) => { // eslint-disable-line consistent-return
    if (err) {
      return cb(err, null);
    }

    try {
      jsonData = JSON.parse(data);
      loadCountries(cb);
    } catch (exc) {
      cb(exc, null);
    }
  });
}

function findCountries(finderFunc, cb) {
  loadCountries((err, countries) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, countries.find(finderFunc));
    }
  });
}

module.exports = {

  getCountryInfo(code, cb) {
    // eslint-disable-next-line func-style
    const finderFunc = (c) => {
      return c.code === code;
    };

    findCountries(finderFunc, cb);
  },

  getCountryInfoByName(name, cb) {
    function finderFunc(c) {
      return c.name === name;
    }

    findCountries(finderFunc, cb);
  },

  getCountryInfoWithRequire(code) {
    const countries = require("./countries.json");
    
    return countries.find((c) => {
      return c.code === code;
    });
  }
  
};

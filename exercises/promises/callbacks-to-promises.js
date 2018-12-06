const http = require("http"),
  url = "http://ws.geeklab.com.ar/dolar/get-dolar-json.php";

function getDollarPriceData(cb) {
  http.get(url, (resp) => {
    let data = "";

    resp.on("data", (chunk) => {
      data += chunk;
    });

    resp.on("end", () => {
      let json = null;
      try {
        json = JSON.parse(data);
        cb(null, json);
      } catch (err) {
        cb(err);
      }
    });

  }).on("error", (err) => {
    cb(err);
  });
}

function calculateConversion(amount, cb) {
  try {
    getDollarPriceData((err, data) => {
      if (err) {
        cb(err);
      } else {
        cb(null, {
          pesos: amount,
          dolar: data.libre,
          conversion: Math.round(amount / data.libre * 100) / 100
        });
      }
    });
  } catch (err) {
    cb(err);
  }
}

calculateConversion(1000, (err, data) => {
  if (err) {
    console.error("Error!!!! :: ", err);
  } else {
    console.log(`Cotización actual: $${data.dolar} =0`);
    console.log(`La cantidad de '${data.pesos}' pesos equivalen actualmente a '${data.conversion}' dolares!`);
  }
});

// Deberia quedar:
// calculateConversion(1000)
//   .then((data) => {
//     console.log(`Cotización actual: $${data.dolar} =0`);
//     console.log(`La cantidad de '${data.pesos}' pesos equivalen actualmente a '${data.conversion}' dolares!`);
//   })
//   .catch((err) => {
//     console.error("Error!!!! :: ", err);
//   });
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const port = 85;
const fs = require("fs");
const connDB = require("./modules/connect");

app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Глобальные заголовки
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  resultJson = {
    isErrors: false,
    orders: [],
  };

  resultJson.orders = txtToArr("Order.txt");

  connDB(req, res, (db) => {
    const dbase = db.db("OrdersForMaster");

    let doc = {
      order: resultJson.orders,
    };
    dbase.collection("orders").insertOne(doc, (err, result) => {
      if (err) {
        resultJson.isErrors = true;
        resultJson.strErrors.push(`Ошибка подключения к базе данных ${err}`);
        res.json(resultJson);
        return console.log(err);
      }
      db.close();
      res.json(resultJson);
    });
  });
});

const txtToArr = function (file) {
  try {
    // Init new array
    let output = null;
    // read the textfile and split to lines
    const line = fs.readFileSync(file).toString().split("\r\n");
    //console.log(line)
    for (i in line) {
      // One line to array
      const lineSplits = line[i].split("%");
      //output.push(lineSplits);
      output = Object.assign({}, [lineSplits]);
      console.log(output);
    }

    //TODO clear the txt file to empty...
    return output;
    // return output;
  } catch (err) {
    resultJson.isErrors = true;
    console.error(err);
  }
};

/**
 * Прослушка порта
 */
app.listen(port, () => {
  console.log("Server started on port " + port);
});

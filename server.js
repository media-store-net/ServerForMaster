const express = require("express");
const app = express();
const http = require("http").Server(app);
const port = 85;
const fs = require("fs");

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

app.post("/", (req, res) => {
  resultJson = {
    isErrors: false,
    orders: [],
  };
  const line = fs.readFileSync("Order.txt").toString().split("\n");
  for (i in line) {
    resultJson.orders = line;
    console.log(line[i]);
  }

  // fs.readFile("Order.txt", "utf8", function (error, data) {
  //   if (error) throw error; // если возникла ошибка
  //   const line = data.split("\n");
  //   resultJson.orders = line;
  // });
  res.json(resultJson);
  console.log(resultJson.orders);
});

/**
 * Прослушка порта
 */
app.listen(port, () => {
  console.log("Server started on port " + port);
});

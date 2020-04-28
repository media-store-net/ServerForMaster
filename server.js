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
  
  resultJson.orders = txtToArr('Order.txt');

  // fs.readFile("Order.txt", "utf8", function (error, data) {
  //   if (error) throw error; // если возникла ошибка
  //   const line = data.split("\n");
  //   resultJson.orders = line;
  // });
  res.json(resultJson);
  console.log(resultJson.orders);
});

const txtToArr = function(file)
{
  try {
    // Init new array
    const output = [];
    // read the textfile and split to lines
    const line = fs.readFileSync(file).toString().split("\r\n");
    for (i in line) {
      console.log(line[i]);
      // One line to array
      const lineSplits = line[i].split("%");
      output.push(lineSplits);
    };

    //TODO clear the txt file to empty...
    return output;
  } catch (err){
    resultJson.isErrors = true;
    console.error(err);
  };
};

/**
 * Прослушка порта
 */
app.listen(port, () => {
  console.log("Server started on port " + port);
});

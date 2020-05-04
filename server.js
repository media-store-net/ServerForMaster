const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const port = 85;
const fs = require("fs");
const dbConfig = require("./config/db");
const mongoose = require("mongoose");
const Order = require("./models/order");

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

// DB Connection
mongoose
  .connect(dbConfig.url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connected"))
  .catch(() => console.log("DB Connection failed"));

app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Выводим все заказы у Мастера и Кладовщика
 */
app.get("/findOrders", (req, res) => {
  Order.find()
    .then((doc) => {
      //console.log(doc);
      res.json(doc);
    })
    .catch((err) => console.log(err));
});

app.get("/checkFiles", (req, res) => {
  //for manually check
  txtToArr("Order.txt");
});

/**
 * Мненяем статус заказа
 */
app.post("/newStatus", (req, res) => {
  //console.log(req.body);
  let orderId = req.body.orderId;
  Order.findOneAndUpdate({ orderId: orderId }, { status: req.body.status })
    .then((doc) => {
      res.json(doc);
      // console.log(doc);
    })
    .catch((err) => console.log(err));
});

/**
 * Считываем фаил, отправлем в MongoDB и очищаем
 */
const txtToArr = async function (file) {
  // Init new array
  try {
    // read the textfile and split to lines
    line = fs.readFileSync(file).toString().split("\r\n"); //(new URL('file:///D:/POS/ЗаявкаНаСклад')
  } catch (err) {
    // resultJson.isErrors = true;
    console.error(err);
  }

  // filter emty values
  line = line.filter((el) => el !== "");

  if (line.length) {
    for (i in line) {
      // One line to array
      const lineSplits = line[i].split("%");

      // Create new Order
      if (lineSplits.length) {
        const order = new Order({
          orderId: lineSplits[0],
          orderDate: lineSplits[1],
          desc: lineSplits[2],
          status: 0,
          cell: 0,
        });

        // save the result
        // console.log("order before save"), console.log(order);
        order
          .save()
          .then(() => {
            console.log("order saved"), console.log(order);
          })
          .catch((err) => console.error(err));
      }
    }
  }

  /**
   *  Очистка файла заказов
   */
  // clear the txt file to empty...
  fs.truncate("Order.txt", 0, function () {
    console.log("Фаил пустой");
  });
  return true;
};
/**
 * Проверка файла с заказами
 */
setInterval(() => {
  txtToArr("Order.txt");
}, 2000);

/**
 * Прослушка порта
 */
app.listen(port, () => {
  console.log("Server started on port " + port);
});

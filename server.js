const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
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

/**
 * Подключение к базе данных
 */
mongoose
  .connect(dbConfig.url, {
    user: dbConfig.user,
    pass: dbConfig.pass,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
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
  //Для ручной проверки
  txtToArr("Order.txt");
});

/**
 * Мненяем статус заказа
 */
app.post("/newStatus", (req, res) => {
  let orderId = req.body.orderId;
  Order.findOneAndUpdate(
    { _id: orderId },
    {
      status: req.body.status,
      cell: req.body.cell,
      dateAssembly: req.body.dateAssembly,
      dateDone: req.body.dateDone,
      dateDone_ready: req.body.dateDone_ready,
      dateErr: req.body.dateErr,
      dateClose: req.body.dateClose,
    }
  )
    .then((doc) => {
      res.json(doc);
      // console.log(doc);
    })
    .catch((err) => console.log(err));
});

/**
 * Считываем фаил, отправлем в MongoDB
 */
const txtToArr = async function (file) {
  // Создаем новый массив
  try {
    // Считываем текстовый файл и разбиваем на строки
    line = fs.readFileSync(file).toString().split("\r\n");
  } catch (err) {
    console.error(err);
  }

  // Отфильтровываем пустые значения
  line = line.filter((el) => el !== "");

  if (line.length) {
    for (i in line) {
      // Преобразовываем 1 строку в массив
      const lineSplits = line[i].split("%");

      // Создаем новый заказ
      if (lineSplits.length) {
        const order = new Order({
          orderId: lineSplits[0],
          orderDate: lineSplits[1],
          desc: lineSplits[2],
        });

        // Создаем новый заказ
        order
          .save()
          .then(() => {
            // console.log("order saved"), console.log(order);
          })
          .catch((err) => console.error(err));
      }
    }
  }

  /**
   *  Очистка файла заказов
   */
  fs.truncate("Order.txt", 0, function () {
    // console.log("Фаил пустой");
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

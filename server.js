const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const port = 85;
const fs = require("fs");
const connDB = require("./modules/connect");
const MongoClient = require("mongodb").MongoClient;
const db = require("./config/db");

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

/**
 * Выводим все заказы у Мастера и Кладовщика
 */
app.get("/", (req, res) => {
  connDB(req, res, (db) => {
    const dbase = db.db("OrdersForMaster");
    resultJson = {
      isErrors: false,
      orders: [],
    };
    dbase.collection("orders").find().toArray((err, result) => {
      if (err) {
        resultJson.isErrors = true;
        resultJson.strErrors.push(`Ошибка подключения к базе данных ${err}`);
        res.json(resultJson);
        return console.log(err);
      }
      db.close();
      resultJson.orders.push(result);
      // console.log(resultJson);
      res.json(resultJson);
    });
  });
});

/**
 * Считываем фаил, отправлем в MongoDB и очищаем
 */
const txtToArr = function () {
  try {
    // Init new array
    let output = null;
    // read the textfile and split to lines
    const line = fs.readFileSync("Order.txt").toString().split("\r\n"); //(new URL('file:///D:/POS/ЗаявкаНаСклад')
    for (i in line) {
      // One line to array
      const lineSplits = line[i].split("%");
      //output.push(lineSplits);
      if (lineSplits.length >= 4) {
        /**
         * Преобразование в объект
         */
        output = Object.assign({}, [lineSplits]);

        /**
         * Подключение и предача в MongoDB
         */
        const client = new MongoClient(db.url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        client.connect((err, db) => {
          if (err) {
            res.send(`Ошибка подключения к базе данных ${err}`);
            return console.log(err);
          }
          const dbase = db.db("OrdersForMaster");
          let doc = {
            order: output,
          };
          dbase.collection("orders").insertOne(doc, (err, result) => {
            if (err) {
              resultJson.isErrors = true;
              resultJson.strErrors.push(
                `Ошибка подключения к базе данных ${err}`
              );
              return console.log(err);
            }
            console.log("Данные отправлены в MongoDB");
            db.close();
          });
        });
      }
    }
    /**
     *  Очистка файла заказов
     */
    fs.truncate("Order.txt", 0, function () {
      console.log("Фаил пустой");
    });
    //TODO clear the txt file to empty...
    return output;
  } catch (err) {
    // resultJson.isErrors = true;
    console.error(err);
  }
};
/**
 * Проверка файла с заказами
 */
setInterval(() => {
  txtToArr();
}, 2000);

/**
 * Прослушка порта
 */
app.listen(port, () => {
  console.log("Server started on port " + port);
});

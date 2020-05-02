const express = require("express");
const router = express.Router();
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const db = require("../config/db");

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
        output = Object.assign({}, lineSplits);
        console.log(lineSplits);

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
          dbase.collection("orders").insertOne(output, (err, result) => {
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
module.exports = router;

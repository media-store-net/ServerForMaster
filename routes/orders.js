const express = require("express");
const router = express.Router();
const connDB = require("../modules/connect");
/**
 * Выводим все заказы у Мастера и Кладовщика
 */
router.get("/findOrder", (req, res) => {
  connDB(req, res, (db) => {
    const dbase = db.db("OrdersForMaster");
    resultJson = {
      isErrors: false,
      orders: null,
    };
    dbase
      .collection("orders")
      .find({})
      .toArray((err, result) => {
        console.log(result);
        if (err) {
          resultJson.isErrors = true;
          resultJson.strErrors.push(`Ошибка подключения к базе данных ${err}`);
          res.json(resultJson);
          return console.log(err);
        }
        db.close();
        resultJson.orders = result;
        res.json(resultJson);
      });
  });
});
module.exports = router;

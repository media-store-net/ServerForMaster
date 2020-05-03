const express = require("express");
const router = express.Router();

/**
 * Выводим все заказы у Мастера и Кладовщика
 */
router.get("/findOrder", (req, res) => {
  Order.find()
    .then((doc) => {
      console.log(doc);
      res.json(doc);
    })
    .catch((err) => console.log(err));
});
module.exports = router;

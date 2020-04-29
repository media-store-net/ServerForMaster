const MongoClient = require("mongodb").MongoClient;
const db = require("../config/db");
/**
 * Подключение к базе данных
 */
module.exports = function connDB(req, res, cd) {
  const client = new MongoClient(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err, db) => {
    if (err) {
      res.send(`Ошибка подключения к базе данных ${err}`);
      return console.log(err);
    }
    cd(db);
  });
};

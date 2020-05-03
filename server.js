const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const port = 85;
const dbConfig = require("./config/db");
const mongoose = require("mongoose");
const Order = require("./models/order");

//DB Connection
mongoose
  .connect(dbConfig.url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connected"))
  .catch(() => console.log("DB Connection failed"));

app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.urlencoded({ extended: true }));

const ordersRoutes = require("./routes/orders");
const writeOrders = require("./routes/writeOrder");

app.get("/", (req, res) => {
  Order.find()
    .then((doc) => {
      console.log(doc);
      res.json(doc);
    })
    .catch((err) => console.log(err));
});

app.get("/checkFiles", (req, res) => {
  //for manually check
  txtToArr("Order.txt");
});

// Create new Order
if (lineSplits.length) {
  const order = new Order({
    orderId: lineSplits[0],
    orderDate: lineSplits[1],
    desc: lineSplits[2],
    status: lineSplits[3],
  });
}
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
 * Пути - Роуты
 */
app.use("/orders", ordersRoutes);
app.use("/", writeOrders);

/**
 * Прослушка порта
 */
app.listen(port, () => {
  console.log("Server started on port " + port);
});

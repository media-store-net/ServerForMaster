const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const port = 85;

app.use(bodyParser.urlencoded({ extended: true }));

const ordersRoutes = require("./routes/orders");
const writeOrders = require("./routes/writeOrder");

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

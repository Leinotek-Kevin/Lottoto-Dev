const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const lottoRoute = require("./routes").lotto;
const fortuneRoute = require("./routes").fortune;
const cors = require("cors");
const port = process.env.PORT || 8080;

const admin = require("firebase-admin");
// const serviceAccount = require("./secret/service-account-key.json");

require("./service/newest-service");

//連結 mongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("連結到 mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Handle Router
app.use("/api/lotto", lottoRoute);
app.use("/api/fortune", fortuneRoute);

//監聽 http request
app.listen(port, () => {
  console.log("後端伺服器聆聽中....");
});

//初始化 firebase admin
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

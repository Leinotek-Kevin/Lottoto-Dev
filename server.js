const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const routes = require("./routes");
const cors = require("cors");
const port = process.env.PORT || 8080;
const admin = require("./utils/checkAdmin-util");

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
app.use("/api/lotto", routes.lotto);
app.use("/api/fortune", routes.fortune);
app.use("/api/cloudmsg", routes.cloudmsg);
app.use("/api/config", routes.config);

//監聽 http request
app.listen(port, () => {
  console.log("後端伺服器聆聽中....");
});

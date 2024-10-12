const router = require("express").Router();

router.use((req, res, next) => {
  console.log("正在接收一個跟運勢相關的 request");
  next();
});

module.exports = router;

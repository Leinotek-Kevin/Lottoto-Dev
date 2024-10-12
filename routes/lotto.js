const router = require("express").Router();

router.use((req, res, next) => {
  console.log("正在接收一個跟樂透相關的 request");
  next();
});

router.getNewestNumbers("/newest", async (req, res) => {
  return res.send("成功連結 lotto route");
});

module.exports = router;
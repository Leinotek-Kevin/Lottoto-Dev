const router = require("express").Router();

router.use((req, res, next) => {
  console.log("正在接收一個跟樂透相關的 request");
  next();
});

//獲取最新的開獎獎號
router.get("/newest", async (req, res) => {
  return res.send({
    status: true,
    message: "成功獲取",
  });
});

module.exports = router;

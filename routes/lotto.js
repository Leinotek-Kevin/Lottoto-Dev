const router = require("express").Router();
const Newest = require("../models/newest-model");

router.use((req, res, next) => {
  console.log("正在接收一個跟樂透相關的 request");
  next();
});

//獲取最新的開獎獎號
router.get("/newest", async (req, res) => {
  try {
    const result = await Newest.find({}).sort({ type: 1 });
    if (result == null || result.length == 0) {
      return res.status(200).send({
        status: true,
        message: "找不到任何彩券資料喔！",
        data: [],
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "成功獲取彩券資料",
        data: result,
      });
    }
  } catch (e) {
    return res.status(404).send({
      status: false,
      message: "伺服器異常！請洽詢後端人員！",
      data: [],
    });
  }
});

module.exports = router;

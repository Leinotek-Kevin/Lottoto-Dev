const router = require("express").Router();
const Newest = require("../models/newest-model");
const newestCrawer = require("../crawer/newest");

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

//清除資料並重新抓取開獎資料
router.post("/crawer-newest", async (req, res) => {
  const result = await Newest.deleteMany({});
  newestCrawer();
  return res.status(200).send({ status: true, message: "爬蟲資料成功" });
});

//更新指定彩券類型資料(不會發推播)
router.post("/update-newest", async (req, res) => {
  let { type, issue, number, specialNumber, date, prizeAmount } = req.body;

  try {
    // 使用 upsert，查詢是否有相同的 type，沒有則新增，有則更新
    const result = await Newest.findOneAndUpdate(
      { type },
      // { type, issue: { $lt: issue } },
      // 查詢條件{type 是主要條件 / issue 是次要條件}
      // 當找不到 type 的時候，就會判定找不到該資料，就執行新增
      // 只有當資料庫中的 issue 小於新 issue 時才更新
      {
        type, // 更新或插入的欄位
        issue,
        number,
        specialNumber,
        date,
        prizeAmount,
      },
      {
        upsert: true, // 如果找不到就新增
        new: true, // 返回更新後的文件
        setDefaultsOnInsert: true, // 插入時應用預設值
      }
    );

    return res
      .status(200)
      .send({ status: true, message: "資料更新成功", result });
  } catch (error) {
    return res
      .status(500)
      .send({ status: true, message: "資料更新失敗", error });
  }
});

module.exports = router;

const router = require("express").Router();
const Fortune = require("../models").fortune;
const fortuneCrawer = require("../crawer/fortune-crawer");

router.use((req, res, next) => {
  console.log("正在接收一個跟運勢相關的 request");
  next();
});

router.post("/daily-info", async (req, res) => {
  let { id } = req.body;

  if (id == null || isNaN(id) || id < 1 || id > 12) {
    return res.status(404).send({
      status: false,
      message: "id 輸入錯誤！",
    });
  }

  try {
    const data = await Fortune.findOne({ elementID: id });

    if (data) {
      return res.status(200).send({
        status: true,
        message: "成功獲取指定星座運勢資料",
        data,
      });
    } else {
      return res.status(200).send({
        status: false,
        message: "查無指定星座運勢資料",
      });
    }
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: "Server Error",
    });
  }
});

router.post("/crawer-fortune", async (req, res) => {
  try {
    fortuneCrawer();
    return res.status(200).send({
      status: true,
      message: "已重新爬蟲並重置",
    });
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: "Server Error",
    });
  }
});

module.exports = router;

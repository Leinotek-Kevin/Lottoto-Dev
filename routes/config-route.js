const router = require("express").Router();
const Config = require("../models/config-model");

router.get("/all", async (req, res) => {
  try {
    const data = await Config.findOne({});

    if (data) {
      return res.status(200).send({
        status: true,
        message: "成功獲取目前各版本資訊",
        data,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "查無任何資料喔！",
      });
    }
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: "Server Error",
      e,
    });
  }
});

router.post("/update", async (req, res) => {
  let { type, version } = req.body;

  try {
    const versionData = await Config.findOne({});

    let storesVersion =
      type == 0 || versionData == null ? version : versionData.storesVersion;

    let data = await Config.findOneAndUpdate(
      {},
      {
        storesVersion,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    if (data) {
      return res.status(200).send({
        status: true,
        message: "版本更新成功",
        data,
      });
    }
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: "Server Error" + e.message,
    });
  }
});

module.exports = router;

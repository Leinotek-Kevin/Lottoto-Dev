const router = require("express").Router();
const Newest = require("../models").newest;
const Record = require("../models").record;
const Banner = require("../models").banner;
const BonusPlacard = require("../models").bonusPlacard;
const BonusInfo = require("../models").bonusInfo;
const Store = require("../models").store;
const CrawerUrl = require("../models").crawerUrl;
const Config = require("../models").config;
const newestCrawer = require("../crawer/force-newest-crawer.js");
const recordCrawer = require("../crawer/record-crawer");

//A-1 獲取最新的開獎獎號
router.get("/newest", async (req, res) => {
  try {
    const result = await Newest.find({}).sort({ type: 1 });
    const config = await Config.findOne({});

    if (result == null || result.length == 0) {
      return res.status(200).send({
        status: true,
        message: "找不到任何彩券資料喔！",
        data: [],
        config,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "成功獲取彩券資料",
        data: result,
        config,
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

//A-2-1 取得活動橫幅列表
router.get("/banner-list", async (req, res) => {
  try {
    const data = await Banner.find({}).sort({ bannerID: 1 });

    if (data == null || data.length == 0) {
      return res.status(200).send({
        status: true,
        message: "查無任何活動 Banner List",
        data: [],
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "成功獲得活動 Banner List",
        data,
      });
    }
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: "Server Error",
    });
  }
});

//A-2-2 新增或更新活動橫幅
router.post("/update-banner", async (req, res) => {
  let { bannerID, bannerPhotoUrl, directUrl } = req.body;

  if (!bannerID || bannerID > 3) {
    return res.status(404).send({
      status: false,
      message: "請輸入 BannerID 或 BannerID 有誤！",
    });
  }

  try {
    const bannerName = ["三節活動資訊", "官網消息", "開獎直播"][bannerID];

    const data = await Banner.findOneAndUpdate(
      {
        bannerID,
      },
      {
        bannerID,
        bannerName,
        bannerPhotoUrl,
        directUrl,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).send({
      status: true,
      message: "更新活動 Banner 成功",
      data,
    });
  } catch (e) {
    return res.status(404).send({
      status: false,
      message: "更新失敗",
      e,
    });
  }
});

//A-3-1 取得加碼公告圖片與是否展示
router.get("/bonus-placard", async (req, res) => {
  try {
    const data = await BonusPlacard.findOne({});

    if (data) {
      return res.status(200).send({
        status: true,
        message: "加碼活動公告圖片是否展示",
        data,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "查無任何活動公告圖片",
      });
    }
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: "server error",
      e,
    });
  }
});

//A-3-2 新增加碼公告圖片與是否展示
router.post("/bonus-placard", async (req, res) => {
  let { needShow, photoUrl } = req.body;

  let placard = new BonusPlacard({
    needShow,
    photoUrl,
  });

  try {
    await BonusPlacard.deleteMany({});
    let savePlacard = await placard.save();

    return res.status(200).send({
      status: true,
      msg: "加碼公告已儲存",
      savePlacard,
    });
  } catch (e) {
    return res.status(500).send({
      status: false,
      msg: "Server Error",
    });
  }
});

//A-4-1 取得加碼開獎資訊
router.get("/bonus-info", async (req, res) => {
  try {
    const data = await BonusInfo.findOne({});

    if (data) {
      return res.status(200).send({
        status: true,
        message: "成功取得加碼開獎資訊",
        data,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "查無加碼開獎資訊",
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

//A-4-2 新增加碼開獎資訊
router.post("/bonus-info", async (req, res) => {
  let { directUrl, festivalID, needShow } = req.body;
  try {
    if (festivalID > 2) {
      return res.status(404).send({
        status: false,
        message: "festivalID 輸入錯誤",
      });
    }

    let isNewYear = needShow == "1" && festivalID == 0,
      isDragonBoatFestival = needShow == "1" && festivalID == 1,
      isMoonFestival = needShow == "1" && festivalID == 2;

    let bonusInfo = new BonusInfo({
      directUrl,
      isDragonBoatFestival,
      isMoonFestival,
      isNewYear,
    });

    const data = await bonusInfo.save();

    if (data) {
      return res.status(200).send({
        status: true,
        message: "成功新增加碼開獎資訊",
        data,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "新增失敗",
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

//A-6 取得彩券行列表
router.get("/stores", async (req, res) => {
  try {
    const data = await Store.find({}).sort({ name: 1 });
    if (data) {
      return res.status(200).send({
        status: true,
        message: "成功獲取商家資訊",
        data,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "查無任何商家資訊",
        data: [],
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

//A-7 取得指定類型的歷史紀錄
router.post("/history-record", async (req, res) => {
  let { type } = req.body;
  try {
    const data = await Record.find({ type }).sort({ issue: -1 });
    //const config = await Config.findOne({});

    if (data) {
      return res.status(200).send({
        status: true,
        message: "成功獲得指定類型歷史紀錄",
        data,
        // config,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "查無任何歷史紀錄",
        data: [],
        // config: {},
      });
    }
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: "Server Error",
    });
  }
});

//A-8 更新指定彩券類型資料(不會發推播)
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

//清除資料並重新抓取開獎資料
router.post("/crawer-newest", async (req, res) => {
  const result = await Newest.deleteMany();
  newestCrawer();
  return res.status(200).send({ status: true, message: "爬蟲資料成功" });
});

//重置並爬蟲所有類型的歷史開獎紀錄
router.post("/crawer-record", async (req, res) => {
  recordCrawer();
  return res.status(200).send({ status: true, message: "爬蟲資料成功" });
});

//設置指定爬蟲網址
router.post("/crawer-url", async (req, res) => {
  let { type, url } = req.body;
  try {
    const data = await CrawerUrl.findOneAndUpdate(
      { crawerType: type },
      {
        crawerType: type,
        crawerUrl: url,
      },
      {
        upsert: true, // 如果找不到就新增
        new: true, // 返回更新後的文件
        setDefaultsOnInsert: true, // 插入時應用預設值
      }
    );

    return res.status(200).send({
      status: true,
      message: "網址設置成功",
      data,
    });
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: "Server Error",
      e,
    });
  }
});

module.exports = router;

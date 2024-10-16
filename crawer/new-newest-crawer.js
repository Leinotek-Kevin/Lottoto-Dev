const Newest = require("../models").newest;
const Record = require("../models").record;
const axios = require("axios");
const cheerio = require("cheerio");

const cloudmsg = require("../utils/cloudmsg-util");

//開獎資訊網址
const drawUrls = [
  //大樂透開獎專區
  "https://www.pilio.idv.tw/main_ltobig.asp",
  //威力彩開獎專區
  "https://www.pilio.idv.tw/main_lto.asp",
  //539 開獎專區
  "https://www.pilio.idv.tw/main_lto539.asp",
  //三四星彩 開獎專區
  "https://www.pilio.idv.tw/main_lto34.asp",
];

//傳入彩券類型
const analysis = async () => {
  getBigAndPowerInfo(drawUrls[0], 0);
  getBigAndPowerInfo(drawUrls[1], 1);
  get539Info(drawUrls[2], 2);
  getStarInfo(drawUrls[3], 5);
  getStarInfo(drawUrls[3], 6);
};

//取得累計金額(大樂透/威力彩)
async function getBigAndPowerInfo(url, type) {
  let targetHTML = await axios.get(url);
  let $ = cheerio.load(targetHTML.data);

  //累積彩金
  const prizeAmount = $("span.title").eq(1).text().match(/(\d+)/)[0];
  //開獎日期
  const date = $("span.title")
    .eq(2)
    .text()
    .match(/(\d{4}\/\d{1,2}\/\d{1,2})/)[0];
  //開獎號碼
  const number = $("span.title")
    .eq(3)
    .text()
    .match(/(\d+(?:,\d+)*)/)[0];
  //開獎特別號
  const specialNumber = $("span.title")
    .eq(3)
    .text()
    .match(/(\d+)$/)[0];

  upsertLotteryInfo({
    type,
    prizeAmount,
    date,
    number,
    specialNumber,
  });
}

async function get539Info(url, type) {
  let targetHTML = await axios.get(url);
  let $ = cheerio.load(targetHTML.data);

  //開獎日期
  const date = $("span.title")
    .eq(1)
    .text()
    .match(/(\d{4}\/\d{1,2}\/\d{1,2})/)[0];
  //開獎號碼
  const number = $("span.title")
    .eq(2)
    .text()
    .match(/(\d+(?:,\d+)*)/)[0];

  upsertLotteryInfo({
    type,
    prizeAmount: "",
    date,
    number,
    specialNumber: "",
  });
}

async function getStarInfo(url, type) {
  let targetHTML = await axios.get(url);
  let $ = cheerio.load(targetHTML.data);

  //開獎日期
  const date = $("span.title")
    .eq(1)
    .text()
    .match(/(\d{4}\/\d{1,2}\/\d{1,2})/)[0];
  //開獎號碼
  const number =
    type == 5
      ? $("span.title").eq(2).text().split("_")[0].split("").join(",")
      : $("span.title").eq(2).text().split("_")[1].split("").join(",");

  upsertLotteryInfo({
    type,
    prizeAmount: "",
    date,
    number,
    specialNumber: "",
  });
}

const upsertLotteryInfo = async (data) => {
  let { type, prizeAmount, date, number, specialNumber } = data;

  //比對資料庫第一筆資料與目前開獎資料的年份
  const recordData = await Record.findOne({ type }).sort({ issue: -1 });

  //紀錄年份
  const recordYear = Number(recordData.date.match(/^(\d{4})/)[0]);
  //開獎年份
  const nowYear = Number(date.match(/^(\d{4})/)[0]);

  if (nowYear > recordYear) {
    //如果是跨年年份，就一定是新資料，將現年推算第一期期數
    console.log("已經跨年了");
    const issue = (nowYear - 1911) * 100000 + 1;
    //將資料灌入 Newest Model
    updateNewestAndRecord({
      type,
      issue,
      date,
      number,
      specialNumber,
      prizeAmount,
    });
  } else if (nowYear == recordYear) {
    console.log("目前是今年");
    //先比對開獎資訊與料庫紀錄的日期，如果一樣就是同一筆紀錄
    const compareDate =
      new Date(date).getTime() === new Date(recordData.date).getTime();

    if (!compareDate) {
      //如果年份相同，但日期不同 =>  將紀錄的期數 +1 給最新開獎作為期數
      const issue = String(Number(recordData.issue) + 1);
      //將資料灌入 Newest Model
      updateNewestAndRecord({
        type,
        issue,
        date,
        number,
        specialNumber,
        prizeAmount,
      });
    } else {
      console.log("該開獎資料與資料庫紀錄一樣");
    }
  }
};

const updateNewestAndRecord = async (data) => {
  let { type } = data;
  try {
    const newestResult = await Newest.findOneAndUpdate({ type }, data, {
      upsert: true, // 如果找不到就新增
      new: true, // 返回更新後的文件
      setDefaultsOnInsert: true, // 插入時應用預設值
    });

    const recordResult = await Record.create(data);

    cloudmsg.sendMsgToTopic("newest", data);
  } catch (e) {
    console.log("新增或更新樂透資料錯誤！" + e);
  }
};

module.exports = analysis;

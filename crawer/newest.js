const Newest = require("../models/newest-model");
const axios = require("axios");
const cheerio = require("cheerio");

//大樂透累積金額
const bigAmoutUrl = "https://www.pilio.idv.tw/ltobig/list.asp";
//威力彩累積金額
const powerAmoutUrl = "https://www.pilio.idv.tw/lto/list.asp";
//開獎資訊網址
const drawUrls = [
  "https://lotto.auzonet.com/biglotto",
  "https://lotto.auzonet.com/power",
  "https://lotto.auzonet.com/daily539",
  "https://lotto.auzonet.com/lotto_historylist_three-star.html",
  "https://lotto.auzonet.com/lotto_historylist_four-star.html",
];

//傳入彩券類型
const analysis = async () => {
  //取得大樂透與威力彩累積金額
  const bigAmoutResult = await getAmount(bigAmoutUrl);
  const powerAmoutResult = await getAmount(powerAmoutUrl);

  //取得大樂透與威力彩開獎資訊
  getBigAndPowerInfo(bigAmoutResult, 0);
  getBigAndPowerInfo(powerAmoutResult, 1);
  get539Info(2);
  getStarInfo(5);
  getStarInfo(6);
};

//取得累計金額(大樂透/威力彩)
async function getAmount(url) {
  let amoutHTML = await axios.get(url);
  let $amout = cheerio.load(amoutHTML.data);

  const result = $amout("table")
    .first()
    .find("tbody tr td")
    .eq(1)
    .find("span")
    .eq(1)
    .text()
    .match(/(\d+(\.\d+)?)/)[0];
  return result;
}

//取得大樂透與威力彩的開獎資訊
async function getBigAndPowerInfo(amout, type) {
  let response = await axios.get(drawUrls[type]);
  let $ = cheerio.load(response.data);

  //抓取目標 td 資料群組
  const targetDatas = $("table.history_view_table")
    .first()
    .find("tbody tr")
    .eq(1)
    .find("td");

  //期數
  const issue = targetDatas.eq(0).find("span").text();

  //開獎日期
  const date = targetDatas
    .eq(0)
    .text()
    //2024-01-01
    .match(/\d{4}-\d{2}-\d{2}/)[0]
    .replace(/-/g, "/");

  //開獎號碼
  let tmpNumbers = [];
  targetDatas
    .eq(1)
    .find("li.ball_blue a")
    .each((index, element) => {
      const number = $(element).text();
      tmpNumbers.push(number);
    });
  const number = tmpNumbers.toString();

  //特別號
  const specialNumber = targetDatas.eq(2).text();

  upsertLotteryInfo({
    type,
    issue,
    date,
    number,
    specialNumber,
    prizeAmount: amout,
  });
}

//取得今彩539 開獎資訊
async function get539Info(type) {
  let response = await axios.get(drawUrls[type]);
  let $ = cheerio.load(response.data);

  //抓取目標 td 資料群組
  const targetDatas = $("table.history_view_table")
    .first()
    .find("tbody tr")
    .eq(1)
    .find("td");

  //期數
  const issue = targetDatas.eq(0).find("span").text();

  //開獎日期
  const date = targetDatas
    .eq(0)
    .text()
    //2024-01-01
    .match(/\d{4}-\d{2}-\d{2}/)[0]
    .replace(/-/g, "/");

  //開獎號碼
  let tmpNumbers = [];
  targetDatas
    .eq(1)
    .find("li.ball_blue a")
    .each((index, element) => {
      const number = $(element).text();
      tmpNumbers.push(number);
    });
  const number = tmpNumbers.toString();

  upsertLotteryInfo({
    type,
    issue,
    date,
    number,
    specialNumber: "",
    prizeAmount: "",
  });
}

//取得三星和四星彩 開獎資訊
async function getStarInfo(type) {
  let response = await axios.get(drawUrls[type - 2]);
  let $ = cheerio.load(response.data);

  //抓取目標 td 資料群組
  const targetDatas = $("table.history_view_table")
    .first()
    .find("tbody tr")
    .eq(1)
    .find("td");

  //期數
  const issue = targetDatas.eq(0).text();

  //開獎日期
  const date = targetDatas.eq(2).find("em").text().replace(/-/g, "/");

  //開獎號碼
  let tmpNumbers = [];
  targetDatas
    .eq(1)
    .find("span")
    .each((index, element) => {
      const number = $(element).text();
      tmpNumbers.push(number);
    });
  const number = tmpNumbers.toString();

  upsertLotteryInfo({
    type,
    issue,
    date,
    number,
    specialNumber: "",
    prizeAmount: "",
  });
}

//新增或更新樂透資料
const upsertLotteryInfo = async ({
  type,
  issue,
  number,
  specialNumber,
  date,
  prizeAmount,
}) => {
  try {
    // 使用 upsert，查詢是否有相同的 type 和 issue，沒有則新增，有則更新
    const result = await Newest.findOneAndUpdate(
      { type, issue }, // 查詢條件
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

    console.log("成功更新或新增資料：", result);
  } catch (error) {
    console.error("更新或新增資料時發生錯誤：", error);
  }
};

module.exports = analysis;

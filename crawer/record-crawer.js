const Record = require("../models").record;
const CrawerUrl = require("../models").crawerUrl;
const axios = require("axios");
const cheerio = require("cheerio");

//歷史開獎紀錄爬蟲
//傳入彩券類型
const analysis = async () => {
  //取得大樂透與威力彩開獎資訊
  getBigAndPowerInfo(0, 24);
  getBigAndPowerInfo(1, 24);
  get539Info(2, 30);
  getStarInfo(5, 30);
  getStarInfo(6, 30);
};

//取得大樂透與威力彩的開獎資訊
async function getBigAndPowerInfo(type, count) {
  const url = await CrawerUrl.findOne({ crawerType: type }).sort({
    crawerType: 1,
  });

  let response = await axios.get(url.crawerUrl);
  let $ = cheerio.load(response.data);

  // 抓取所有 .history_view_table
  const tables = $("table.history_view_table").slice(0, count);

  let infos = [];

  // 遍歷每個表格
  tables.each((index, table) => {
    // 抓取 <tbody> 的第二個 <tr>
    const secRow = $(table).find("tbody tr").eq(1);

    // 抓取該 <tr> 中的所有 <td>
    const targetDatas = secRow.find("td");

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

    infos.push({
      type,
      issue,
      date,
      number,
      specialNumber,
    });
  });

  uploadLotteryInfo(infos, type);
}

//取得今彩539 開獎資訊
async function get539Info(type, count) {
  const url = await CrawerUrl.findOne({ crawerType: type }).sort({
    crawerType: 1,
  });

  let response = await axios.get(url.crawerUrl);
  let $ = cheerio.load(response.data);

  //抓取所有 .history_view_table
  const tables = $("table.history_view_table").slice(0, count);

  let infos = [];

  //遍歷每個表格
  tables.each((index, table) => {
    // 抓取 <tbody> 的第二個 <tr>
    const secRow = $(table).find("tbody tr").eq(1);

    // 抓取該 <tr> 中的所有 <td>
    const targetDatas = secRow.find("td");

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

    infos.push({
      type,
      issue,
      date,
      number,
    });
  });

  uploadLotteryInfo(infos, type);
}

//取得三星和四星彩 開獎資訊
async function getStarInfo(type, count) {
  const url = await CrawerUrl.findOne({ crawerType: type }).sort({
    crawerType: 1,
  });
  let response = await axios.get(url.crawerUrl);
  let $ = cheerio.load(response.data);

  // 抓取所有 .history_view_table
  const rows = $("tr.history_view_star").slice(0, count);

  let infos = [];

  //遍歷每個表格
  rows.each((index, row) => {
    // 抓取該 <tr> 中的所有 <td>
    const targetDatas = $(row).find("td");
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

    infos.push({ type, issue, date, number });
  });

  uploadLotteryInfo(infos, type);
}

//新增或更新樂透資料
const uploadLotteryInfo = async (data, type) => {
  try {
    await Record.deleteMany({ type });
    const newDoc = await Record.insertMany(data);
  } catch (err) {
    console.error("發生錯誤", err);
  }
};

module.exports = analysis;

const axios = require("axios");
const cheerio = require("cheerio");
const Fortune = require("../models").fortune;
const mongoose = require("mongoose");

//每日運勢爬蟲
const getAllFortuneInfo = async () => {
  try {
    //連結 mongoDB
    mongoose
      .connect(process.env.MONGODB_CONNECTION)
      .then(() => {
        console.log("連結到 mongoDB");
      })
      .catch((e) => {
        console.log(e);
      });

    const today = getTaiwanDate();

    for (let i = 1; i < 13; i++) {
      const recordElement = await Fortune.findOne({ elementID: i });

      let needFetch = false;

      if (recordElement == null) {
        //資料庫沒有記錄日期
        needFetch = true;
        console.log("星座運勢：找不到任何指定星座的資料->允許更新資料");
      } else {
        const recordDate = recordElement.recordDate;
        if (recordDate == null) {
          needFetch = true;
          console.log("星座運勢：指定星座無紀錄日期->允許更新資料");
        } else if (new Date(today) > new Date(recordDate)) {
          //今天的日期大於資料庫記錄的日期
          needFetch = true;
          console.log("星座運勢：今天的日期大於資料庫記錄的日期->允許更新資料");
        }
      }

      let fortuneUrl = `https://news.pchome.com.tw/constellation.php?sign_id=${i}&sdate=${today}&mode=sign&type=day`;
      let response = await axios.get(fortuneUrl);
      let $ = cheerio.load(response.data);

      let elementName,
        totalFortuneIndex,
        loveFortuneIndex,
        workFortuneIndex,
        healthFortuneIndex,
        moneyFortuneIndex,
        communicationFortuneIndex,
        luckyNumber,
        luckyColor,
        noblemanElement,
        villainElement,
        goodLuckWay,
        luckyTime,
        goodLuckAccessories,
        goodLuckFood,
        tabooToday,
        peachBlossomElement,
        elementPeriod,
        totalFortuneDetail,
        loveFortuneDetail,
        moneyFortuneDetail,
        healthFortuneDetail,
        dailySuggestion;

      //上半部運勢表格爬蟲
      const fortuneRows = $("div.article_mod tbody").find("tr");
      elementName = $("div.tit_n").text() + "座";
      elementID = i;

      for (let i = 0; i < fortuneRows.length; i++) {
        let fortuneRowHTML = $(fortuneRows[i]);

        if (i == 0) {
          //  整體運勢指數＆感情運指數
          totalFortuneIndex = fortuneRowHTML
            .find("td")
            .eq(1)
            .find("ul.whl_star li.pul_str").length;
          loveFortuneIndex = fortuneRowHTML
            .find("td")
            .eq(3)
            .find("ul.love_star li.str").length;
        }

        if (i == 1) {
          //  工作運指數＆健康指數
          workFortuneIndex = fortuneRowHTML
            .find("td")
            .eq(1)
            .find("ul.wrk_star li.str").length;
          healthFortuneIndex = fortuneRowHTML
            .find("td")
            .eq(3)
            .find("ul.hlth_star li.str").length;
        }

        if (i == 2) {
          //  財運指數＆商談指數
          moneyFortuneIndex = fortuneRowHTML
            .find("td")
            .eq(1)
            .find("ul.money_star li.str").length;
          communicationFortuneIndex = fortuneRowHTML
            .find("td")
            .eq(3)
            .find("ul.nigt_star li.str").length;
        }

        if (i == 3) {
          //  好運數字＆幸運色
          luckyNumber = fortuneRowHTML.find("td").eq(1).text();
          luckyColor = fortuneRowHTML.find("td").eq(3).text();
        }

        if (i == 4) {
          //  貴人星座＆小人星座
          noblemanElement = fortuneRowHTML.find("td").eq(1).text() + "座";
          villainElement = fortuneRowHTML.find("td").eq(3).text() + "座";
        }

        if (i == 5) {
          //  開運方位＆吉時
          goodLuckWay = fortuneRowHTML.find("td").eq(1).text();
          luckyTime = fortuneRowHTML.find("td").eq(3).text();
        }

        if (i == 6) {
          //  開運飾品＆開運食材
          goodLuckAccessories = fortuneRowHTML.find("td").eq(1).text();
          goodLuckFood = fortuneRowHTML.find("td").eq(3).text();
        }

        if (i == 7) {
          //  今日禁忌＆桃花星座
          tabooToday = fortuneRowHTML.find("td").eq(1).text();
          peachBlossomElement = fortuneRowHTML.find("td").eq(3).text() + "座";
        }

        if (i == 8) {
          //  星座日期
          elementPeriod = fortuneRowHTML.find("td").eq(1).text();
        }
      }

      //下半部運勢描述爬蟲
      const details = $("p.dtl_staus");

      for (let i = 0; i < details.length; i++) {
        const detail = $(details[i]).text();
        if (i == 0) {
          //整體運勢
          totalFortuneDetail = detail;
        }
        if (i == 1) {
          //感情運勢
          loveFortuneDetail = detail;
        }

        if (i == 2) {
          //財運運勢
          moneyFortuneDetail = detail;
        }

        if (i == 3) {
          //健康運勢
          healthFortuneDetail = detail;
        }

        if (i == 4) {
          //每日建議
          dailySuggestion = detail;
        }
      }

      //防呆資料異常
      if (
        isNotNullOrEmpty(elementName) &&
        isNotNullOrEmpty(totalFortuneDetail) &&
        isNotNullOrEmpty(loveFortuneDetail) &&
        isNotNullOrEmpty(moneyFortuneDetail)
      ) {
        console.log("星座運勢：" + "已確保有爬取資料");

        if (needFetch) {
          console.log("星座運勢：" + "資料庫資料允許更新");

          try {
            // 將 timestamp 轉換成 Date 物件
            const date = new Date();

            // 定義選項來格式化日期
            const options = {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              weekday: "short",
            };

            // 使用 toLocaleDateString 格式化
            const updateDate = date
              .toLocaleDateString("zh-TW", options)
              .replace("週", "")
              .replace("）", ")")
              .replace("（", "(");

            const result = await Fortune.findOneAndUpdate(
              {
                elementID,
              },
              {
                recordDate: today,
                elementName,
                totalFortuneIndex,
                loveFortuneIndex,
                workFortuneIndex,
                healthFortuneIndex,
                moneyFortuneIndex,
                communicationFortuneIndex,
                luckyNumber,
                luckyColor,
                noblemanElement,
                villainElement,
                goodLuckWay,
                luckyTime,
                goodLuckAccessories,
                goodLuckFood,
                tabooToday,
                peachBlossomElement,
                elementPeriod,
                totalFortuneDetail,
                loveFortuneDetail,
                moneyFortuneDetail,
                healthFortuneDetail,
                dailySuggestion,
                updateDate,
              },
              {
                upsert: true, // 如果找不到就新增
                new: true, // 返回更新後的文件
                setDefaultsOnInsert: true, // 插入時應用預設值
              }
            );
            console.log(elementName + "座資料已更新！" + " " + result);
          } catch (e) {
            console.log(elementName + "座座資料抓取異常！" + e);
          }
        } else {
          console.log("星座運勢：" + "資料庫資料不更新");
        }
      }
    }

    //console.log(fortuneInfos);
    //將運勢資料存入DB
    //await Fortune.deleteMany();
    //const result = await Fortune.insertMany(fortuneInfos);
    //console.log("將運勢資料存入DB:" + result);
  } catch (e) {
    console.log("運勢爬蟲有問題" + e);
  }
};

function getTaiwanDate() {
  // 獲取當前 UTC 時間
  const now = new Date();

  // 計算台灣的 UTC+8 時間
  const taiwanTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

  // 取得年份、月份和日期
  const year = taiwanTime.getFullYear();
  const month = String(taiwanTime.getMonth() + 1).padStart(2, "0"); // 月份從 0 開始
  const day = String(taiwanTime.getDate()).padStart(2, "0");

  // 返回格式化的日期
  return `${year}-${month}-${day}`;
}

function isNotNullOrEmpty(str) {
  return str !== null && str !== undefined && str.trim() !== "";
}

module.exports = getAllFortuneInfo;

const newestCrawer = require("../crawer/newest-crawer");

let isFetchingLock = false; //狀態變數

const fetch = () => {
  newestCrawer();
};

//設定每天 20:30-21:30 期間每10分鐘抓一次
const startFetching = () => {
  const now = new Date();
  const startHour = 20; //晚上八點
  if (
    now.getHours() === startHour &&
    now.getMinutes() >= 30 &&
    !isFetchingLock
  ) {
    console.log("最新開獎結果：進入抓取時間範圍內");
    isFetchingLock = true; //設定正在抓取

    //符合條件立即抓取一次
    fetch();

    const interal = setInterval(fetch, 10 * 60 * 1000); //每10分鐘執行一次

    //設定結束時間
    setTimeout(() => {
      clearInterval(interal); //停止抓取
      console.log("停止抓取最新開獎結果");
      isFetchingLock = false; //重置狀態
    }, 60 * 60 * 1000); //持續一小時
  } else {
    if (isFetchingLock) {
      console.log(
        "最新開獎結果：已進入抓取時間範圍並已啟動抓取排程" + isFetchingLock
      );
    } else {
      console.log("最新開獎結果：當前不再抓取時間範圍內");
    }
  }
};

//module.exports = startFetching;

startFetching();

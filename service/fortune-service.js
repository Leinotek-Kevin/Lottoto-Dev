const fortuneCrawer = require("../crawer/fortune-crawer");

let isFetchingLock = false; //狀態變數

const fetch = () => {
  fortuneCrawer();
};

//設定每天 00:10-00:40 期間每10分鐘抓一次
const startFetching = () => {
  const now = new Date();
  const startHour = 0; //午夜 12 點

  if (
    now.getHours() === startHour &&
    now.getMinutes() >= 10 &&
    !isFetchingLock
  ) {
    console.log("星座運勢：進入抓取時間範圍內");
    isFetchingLock = true; //設定正在抓取

    //符合條件立即抓取一次
    fetch();

    const interal = setInterval(fetch, 10 * 60 * 1000); //每10分鐘執行一次

    //設定結束時間
    setTimeout(() => {
      clearInterval(interal); //停止抓取
      console.log("停止抓取星座資料");
      isFetchingLock = false; //重置狀態
    }, 30 * 60 * 1000); //持續半小時
  } else {
    if (isFetchingLock) {
      console.log(
        "星座運勢：已進入抓取時間範圍並已啟動抓取排程" + isFetchingLock
      );
    } else {
      console.log("星座運勢：當前不再抓取時間範圍內");
    }
  }
};

module.exports = startFetching;

const newestCrawer = require("../crawer/newest");

let isFetching = false; //狀態變數

const fetch = () => {
  newestCrawer();
};

//設定每天執行
const startFetching = () => {
  const now = new Date();
  const startHour = 20; //8PM

  if (now.getHours() === startHour && now.getMinutes() >= 30 && !isFetching) {
    console.log("進入抓取時間範圍內");
    isFetching = true; //設定正在抓取

    //符合條件立即抓取一次
    fetch();

    const interal = setInterval(fetch, 10 * 60 * 1000); //每10分鐘執行一次

    //設定結束時間
    setTimeout(() => {
      clearInterval(interal); //停止抓取
      console.log("停止抓取資料");
      isFetching = false; //重置狀態
    }, 60 * 60 * 1000); //持續一小時
  } else {
    console.log("當前不再抓取時間範圍內");
  }
};

//每分鐘檢查一次
startFetching();
setInterval(startFetching, 60 * 1000);

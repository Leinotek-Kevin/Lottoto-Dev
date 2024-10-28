const newestService = require("./newest-service");
const fortuneService = require("./fortune-service");
const dotenv = require("dotenv");
dotenv.config();

//設定每天執行
const startFetching = () => {
  //最新開獎服務
  newestService();
  //最新星座運勢服務
  fortuneService();
};

//部署的時候直接執行一次
//startFetching();
//每分鐘檢查一次
if (process.env.HEROKU_ENV !== "DEBUG") {
  console.log("正式站啟動定時服務");
  setInterval(startFetching, 60 * 1000);
} else {
  console.log("開發站不啟動定時服務");
}

const newestService = require("./newest-service");
const fortuneService = require("./fortune-service");

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
setInterval(startFetching, 60 * 1000);

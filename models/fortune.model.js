const mongoose = require("mongoose");
const { Schema } = mongoose;

//製作運勢 Schema
const fortuneSchema = new Schema({
  //星座 id
  // 1: 白羊座 2: 金牛座 3:雙子座 4:巨蟹座 5:獅子座 6:處女座
  // 7: 天秤座 8: 天蠍座 9:射手座 10:摩羯座 11:水瓶座 12:雙魚座
  elementID: {
    type: Number,
    required: true,
  },

  //星座名稱
  elementName: String,
  //整體運勢指數
  totalFortuneIndex: Number,
  //感情運指數
  loveFortuneIndex: Number,
  //工作運指數
  workFortuneIndex: Number,
  //健康指數
  healthFortuneIndex: Number,
  //財運指數
  moneyFortuneIndex: Number,
  //商談指數,
  communicationFortuneIndex: Number,
  //好運數字
  luckyNumber: Number,
  //幸運色
  luckyColor: String,
  //貴人星座
  noblemanElement: String,
  //小人星座
  villainElement: String,
  //開運方位
  goodLuckWay: String,
  //吉時
  luckyTime: String,
  //開運飾品
  goodLuckAccessories: String,
  //開運食材
  goodLuckFood: String,
  //今日禁忌
  tabooToday: String,
  //桃花星座,
  peachBlossomElement: String,
  //星座日期
  elementPeriod: String,
  //整體運勢敘述
  totalFortuneDetail: String,
  //感情運勢敘述
  loveFortuneDetail: String,
  //財運運勢敘述
  moneyFortuneDetail: String,
  //健康運勢敘述
  healthFortuneDetail: String,
  //每日建議敘述
  dailySuggestion: String,

  //更新時間
  updateTime: {
    type: Number,
    default: Date.now,
  },
});

//隱藏 _id,__v
fortuneSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Fortune", fortuneSchema);

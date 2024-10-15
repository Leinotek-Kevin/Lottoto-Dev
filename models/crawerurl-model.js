const mongoose = require("mongoose");
const { Schema } = mongoose;

const crawerUrlSchema = new Schema({
  //爬蟲指定類型
  //   0:大樂透歷史紀錄 1:威力彩歷史紀錄2:539歷史紀錄   5:3星彩歷史紀錄
  //   6:4星彩歷史紀錄
  //   3:大樂透累積金額 4: 威力彩累積金額
  crawerType: {
    type: Number,
    required: true,
  },

  //爬蟲網址
  crawerUrl: {
    type: String,
    required: true,
  },

  //更新時間
  updateTime: {
    type: Number,
    default: Date.now,
  },
});

//隱藏 _id,__v
crawerUrlSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
module.exports = mongoose.model("CrawerUrl", crawerUrlSchema);

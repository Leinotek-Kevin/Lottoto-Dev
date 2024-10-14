const mongoose = require("mongoose");
const { Schema } = mongoose;

//製作最新開獎資訊 Schema
const newestSchema = new Schema({
  //彩券類型
  type: {
    type: Number,
    //0:大樂透 1:威力彩 2:今彩539 5:三星彩 6:四星彩
    enum: [0, 1, 2, 5, 6],
    required: true,
  },

  //期數
  issue: {
    type: String,
    required: true,
  },

  //開獎號碼
  number: {
    type: String,
    required: true,
  },

  //特別號碼
  specialNumber: {
    type: String,
    default: "",
    required: false,
  },

  //開獎日期
  date: {
    type: String,
    required: true,
  },

  //獎金總額
  prizeAmount: {
    type: String,
    default: "",
    required: false,
  },

  //更新時間
  updateTime: {
    type: Number,
    default: Date.now,
  },
});
// 添加唯一複合索引
// newestSchema.index({ type: 1, issue: 1 }, { unique: true });

// 添加唯一索引
newestSchema.index({ type: 1 }, { unique: true });

//隱藏 _id,__v
newestSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Newest", newestSchema);

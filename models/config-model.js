const mongoose = require("mongoose");
const { Schema } = mongoose;

//製作APP各個資料版本抓取 Schema
const configSchema = new Schema({
  //地圖資料版本
  storesVersion: {
    type: Number,
  },

  //更新時間
  updateTime: {
    type: Number,
    default: Date.now,
  },
});

//隱藏 _id,__v
configSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Config", configSchema);

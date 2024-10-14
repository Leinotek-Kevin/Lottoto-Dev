const mongoose = require("mongoose");
const { Schema } = mongoose;

//製作活度橫幅 Schema
//0:三節活動資訊 1:官網消息 2:開獎直播
const bannerSchema = new Schema({
  //活動 ID
  bannerID: {
    type: Number,
    enum: [0, 1, 2],
    required: true,
  },
  //橫幅名稱
  bannerName: {
    type: String,
  },

  //活動圖片網址
  bannerPhotoUrl: {
    type: String,
    required: true,
  },

  //活動導向網址
  directUrl: {
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
bannerSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Banner", bannerSchema);

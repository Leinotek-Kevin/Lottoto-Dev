const mongoose = require("mongoose");
const { Schema } = mongoose;

//製作彩券行 Schema
const storeSchema = new Schema({
  //彩券行名稱
  name: {
    type: String,
    required: true,
  },

  //彩券行地址
  location: {
    type: String,
    required: true,
  },

  //緯度
  latitude: {
    type: Number,
    required: true,
  },

  //經度
  longitude: {
    type: Number,
    required: true,
  },

  //中獎次數
  winTime: {
    type: String,
  },

  //更新時間
  updateTime: {
    type: Number,
    default: Date.now,
  },
});

//隱藏 _id,__v
storeSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Store", storeSchema);

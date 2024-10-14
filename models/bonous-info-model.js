const mongoose = require("mongoose");
const { Schema } = mongoose;

//製作加碼開獎資訊
const BonusInfoSchema = new Schema({
  //加碼開獎資訊導向連結
  directUrl: {
    type: String,
    required: true,
  },

  isNewYear: {
    type: Boolean,
    required: true,
  },

  isDragonBoatFestival: {
    type: Boolean,
    required: true,
  },

  isMoonFestival: {
    type: Boolean,
    required: true,
  },

  //更新時間
  updateTime: {
    type: Number,
    default: Date.now,
  },
});

//隱藏 _id,__v
BonusInfoSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("BonusInfo", BonusInfoSchema);

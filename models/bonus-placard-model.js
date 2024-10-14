const mongoose = require("mongoose");
const { Schema } = mongoose;

//製作加碼公告資訊
const BonusPlacardSchema = new Schema({
  //加碼公告圖片
  photoUrl: {
    type: String,
    required: true,
  },

  //使否要顯示 (0:false , 1:true)
  needShow: {
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
BonusPlacardSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("BonusPlacard", BonusPlacardSchema);

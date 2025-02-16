const admin = require("./checkAdmin-util");
const typeNames = ["大樂透", "威力彩", "今彩539", "", "", "三星彩", "四星彩"];

class CloudMsgService {
  // 發送推播(針對設備)
  static async sendMsgToDevice(token, data) {
    let { type, number } = data;

    const message = {
      token: token, // 設備的 FCM token
      notification: {
        title: typeNames[Number(type)] + "開獎囉！",
        body: "快來看看有沒有中獎喔！",
      },
      data: {
        type: type.toString(),
        number: number,
      },
    };

    // 發送到指定設備
    try {
      const response = await admin.messaging().send(message);
      console.log("推播設備成功：" + message.notification.title, response);
      return true;
    } catch (e) {
      console.log("推播設備失敗", e);
      return true;
    }
  }

  // 發送推播(針對主題)
  static async sendMsgToTopic(topic, newData) {
    let { type, number } = newData;
    let typeName = typeNames[Number(type)];

    if (type == 5) {
      //三星彩不發推播
      return "不發推播";
    }

    if (type == 6) {
      typeName = "三星彩,四星彩";
    }

    const message = {
      notification: {
        title: "《" + typeName + "》" + " 最新獎號更新囉✨",
        body: "快來看看你有沒有中獎！",
      },
      data: {
        type: type.toString(),
        number,
      },

      topic: topic, // 指定主題
    };

    let msgResult = "";

    // 發送到指定主題
    try {
      const response = await admin.messaging().send(message);
      console.log("推播主題成功" + message.notification.title, response);
      msgResult = "成功推播";
    } catch (e) {
      console.log("推播主題失敗", e);
      msgResult = "失敗推播 " + e;
    }
    return msgResult;
  }
}

module.exports = CloudMsgService;

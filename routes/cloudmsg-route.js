const router = require("express").Router();
const cloudmsg = require("../utils/cloudmsg-util");

//針對設備推播測試
router.post("/device", async (req, res) => {
  let { token } = req.body;

  if (token) {
    const result = await cloudmsg.sendMsgToDevice(token, {
      type: 0,
      number: "1,2,3",
    });

    return res
      .status(200)
      .send({ status: true, message: result ? "推播已經發送" : "發送失敗" });
  } else {
    return res.status(404).send({ status: false, message: "發送失敗" });
  }
});

//針對主題推播測試
router.post("/topic", async (req, res) => {
  let { topic } = req.body;

  if (topic) {
    const result = await cloudmsg.sendMsgToTopic(topic, {
      type: 0,
      number: "1,2,3",
    });

    return res
      .status(200)
      .send({ status: true, message: result ? "推播已經發送" : "發送失敗" });
  } else {
    return res.status(404).send({ status: false, message: "發送失敗" });
  }
});

module.exports = router;

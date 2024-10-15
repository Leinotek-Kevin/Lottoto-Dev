const fs = require("fs").promises;

// 读取 JSON 字符串的函数
async function readJsonFromFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    throw error;
  }
}

// shopsReader("./shop.txt")
//   .then(async (jsonData) => {
//     //console.log("成功读取的 JSON 数据:", jsonData);
//     const result = await Store.insertMany(jsonData);
//     const count = await Store.countDocuments();
//     console.log("數量：" + count);
//   })
//   .catch((error) => {
//     console.error("读取 JSON 文件时出错:", error);
//   });

module.exports = readJsonFromFile;

const axios = require("axios");
require("dotenv").config();

async function sendWebhook(path, data) {
  const url = process.env.FLAG_PROVIDER_URL + path;
  try {
    await axios.post(url, data);
  } catch (err) {
    console.log(err);
    throw new Error("Error sending webhook");
  }
}

module.exports.sendWebhook = sendWebhook;

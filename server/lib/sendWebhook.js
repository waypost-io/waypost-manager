const axios = require("axios");
require("dotenv").config();

async function sendWebhook(data) {
  try {
    await axios.post(process.env.FLAG_PROVIDER_URL, data);
  } catch (err) {
    console.log(err);
  }
}

module.exports.sendWebhook = sendWebhook;

const axios = require("axios");
require("dotenv").config();

async function sendWebhook(data) {
  try {
    console.log(data);
    const result = await axios.post(process.env.FLAG_PROVIDER_URL, data);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

module.exports.sendWebhook = sendWebhook;

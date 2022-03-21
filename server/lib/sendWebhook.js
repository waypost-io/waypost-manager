const axios = require("axios");
require("dotenv").config();

async function sendWebhook(path, data) {
  const url = process.env.FLAG_PROVIDER_URL + path;
  try {
    await axios.post(url, data);
  } catch (err) {
    throw new Error(`Error sending webhook to ${path}`);
  }
}

module.exports.sendWebhook = sendWebhook;

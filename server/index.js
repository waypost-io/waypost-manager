require("dotenv").config();
const express = require('express');
const routes = require('./routes/api');
const cron = require('node-cron');
const { backfillExposures } = require('./lib/experimentSummary');

const app = express();

const port = 5000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.use('/api', routes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({ error: err.message || "An unknown error occured" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});

// Testing CRON job every 10 seconds
cron.schedule('10 * * * * *', async () => {
  // backfillExposures();
  console.log('CRON running')
});

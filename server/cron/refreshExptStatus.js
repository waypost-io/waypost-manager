const cron = require('node-cron');
const { backfill } = require('../lib/experimentSummary');

// Runs once immediately for testing purposes
backfill();
/*
crontab syntax:
A single asterisk means the task will be run for every instance of that unit of time
  * * * * * *
  | | | | | |
  | | | | | day of week
  | | | | month
  | | | day of month
  | | hour
  | minute
  second ( optional )

For once daily at 3am, use '0 3 * * *'
*/
// cron.schedule('10 * * * * *', async () => {
//   backfill();
//   console.log('CRON running')
// });

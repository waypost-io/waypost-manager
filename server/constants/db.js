exports.FLAG_TABLE_NAME = "flags";
exports.EXPERIMENTS_TABLE_NAME = "experiments";
exports.METRICS_TABLE_NAME = "metrics";
exports.GET_EXPERIMENTS_QUERY = `SELECT *  FROM experiments
                                 WHERE flag_id = $1
                                 ORDER BY date_started DESC;`;

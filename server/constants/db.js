exports.FLAG_TABLE_NAME = "flags";
exports.EXPERIMENTS_TABLE_NAME = "experiments";
exports.EXPERIMENT_METRICS_TABLE_NAME = "experiment_metrics";
exports.EXPOSURES_TABLE_NAME = "exposures";
exports.METRICS_TABLE_NAME = "metrics";
exports.CONNECTION_TABLE_NAME = "connection";
exports.GET_EXPERIMENTS_QUERY = `SELECT *  FROM experiments
                                 WHERE flag_id = $1
                                 ORDER BY id DESC;`;
exports.METRIC_TYPES = ['binomial', 'count', 'duration', 'revenue'];
exports.REQUIRED_EVENT_DB_COLS = ['user_id', 'timestamp', 'treatment'];

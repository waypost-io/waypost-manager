exports.FLAG_TABLE_NAME = "flags";
exports.EXPERIMENTS_TABLE_NAME = "experiments";
exports.EXPERIMENT_METRICS_TABLE_NAME = "experiment_metrics";
exports.EXPOSURES_TABLE_NAME = "exposures";
exports.METRICS_TABLE_NAME = "metrics";
exports.GET_EXPERIMENTS_QUERY = `SELECT *  FROM experiments
                                 WHERE flag_id = $1
                                 ORDER BY date_started DESC;`;
exports.METRIC_TYPES = ['binomial', 'count', 'duration', 'revenue'];
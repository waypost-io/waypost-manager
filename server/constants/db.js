exports.FLAG_TABLE_NAME = "flags";
exports.EXPERIMENTS_TABLE_NAME = "experiments";
exports.EXPERIMENT_METRICS_TABLE_NAME = "experiment_metrics";
exports.EXPOSURES_TABLE_NAME = "exposures";
exports.METRICS_TABLE_NAME = "metrics";
exports.CONNECTION_TABLE_NAME = "connection";
exports.GET_EXPT_METRICS_QUERY = `SELECT e.* ,
                                    em.metric_id,
                                    m.name,
                                    m.type,
                                    em.mean_test,
                                    em.mean_control,
                                    em.interval_start,
                                    em.interval_end,
                                    em.p_value
                                FROM experiments e
                                 JOIN experiment_metrics em
                                  ON e.id=em.experiment_id
                                 JOIN metrics m
                                  ON em.metric_id = m.id
                                 WHERE flag_id = $1
                                 ORDER BY e.id DESC;`;
exports.GET_EXPOSURES_ON_EXPT = `SELECT variant, num_users, date
                                 FROM exposures
                                 WHERE experiment_id = $1
                                 ORDER BY date ASC;`
exports.METRIC_TYPES = ['binomial', 'count', 'duration', 'revenue'];
exports.REQUIRED_EVENT_DB_COLS = ['experiment_id', 'user_id', 'timestamp', 'treatment'];

exports.FLAG_TABLE_NAME = "flags";
exports.FLAG_EVENTS_TABLE_NAME = "flag_events";
exports.EXPERIMENTS_TABLE_NAME = "experiments";
exports.EXPERIMENT_METRICS_TABLE_NAME = "experiment_metrics";
exports.EXPOSURES_TABLE_NAME = "exposures";
exports.METRICS_TABLE_NAME = "metrics";
exports.CONNECTION_TABLE_NAME = "connection";
exports.KEYS_TABLE_NAME = "keys";
exports.CA_TABLE_NAME = "custom_assignments";
exports.METRIC_TYPES = ["binomial", "count", "duration", "revenue"];
exports.REQUIRED_EVENT_DB_COLS = [
  "experiment_id",
  "user_id",
  "timestamp",
  "treatment",
];

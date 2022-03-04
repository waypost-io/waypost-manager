const { check, oneOf } = require("express-validator");
const { FLAGS_COL_NAMES } = require("../constants/db");

exports.validateNewFlag = [check("name").not().isEmpty()];
// exports.validateEditFlag = [body(check("*").oneOf.FLAGS_COL_NAMES];
// maybe do some schema validation https://express-validator.github.io/docs/schema-validation.html
exports.validateSDKKey = [];

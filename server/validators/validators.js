const { check, oneOf } = require("express-validator");

exports.validateNewFlag = [check("name").not().isEmpty()];
exports.validateEditFlag = [];
exports.validateSDKKey = [];

const { body } = require("express-validator");

const loginRules = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password required"),
];

const forgotRules = [
  body("email").isEmail().withMessage("Valid email required"),
];

const resetRules = [
  body("password").isLength({ min: 6 }).withMessage("Min 6 chars"),
];

module.exports = { loginRules, forgotRules, resetRules };

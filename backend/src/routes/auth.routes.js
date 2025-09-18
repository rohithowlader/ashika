const express = require("express");
const router = express.Router();
const {
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const {
  loginRules,
  forgotRules,
  resetRules,
} = require("../validators/auth.validation");

// /api/auth
router.post("/login", loginRules, login);
router.post("/forgot-password", forgotRules, forgotPassword);
router.post("/reset-password/:token", resetRules, resetPassword);

module.exports = router;

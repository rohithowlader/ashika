const jwt = require("jsonwebtoken");

const signAuthToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "1d",
  });
};

module.exports = { signAuthToken };

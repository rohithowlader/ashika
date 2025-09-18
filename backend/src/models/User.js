const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    // secure reset
    resetPasswordTokenHash: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// hash password on save (if modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// create secure reset token (store only hash)
userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  this.resetPasswordTokenHash = hash;
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
  return token; // plain (to email)
};

module.exports = mongoose.model("User", userSchema);

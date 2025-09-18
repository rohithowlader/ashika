const { validationResult } = require("express-validator");
const crypto = require("crypto");
const User = require("../models/User");
const { signAuthToken } = require("../utils/generateToken");
const { sendEmail } = require("../utils/sendEmail");

const FRONTEND_URL = process.env.FRONTEND_URL;

// POST /api/auth/login
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ msg: errors.array()[0].msg });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const ok = await user.comparePassword(password);
  console.log(ok);
  if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

  const token = signAuthToken(user._id);
  return res.json({ token, user: { id: user._id, email: user.email } });
}

// POST /api/auth/forgot-password
async function forgotPassword(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ msg: errors.array()[0].msg });

  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(200)
      .json({ msg: "If that email exists, a link has been sent" }); // don’t reveal

  const token = user.createPasswordResetToken();
  await user.save();

  const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
  const html = `
    <div style="font-family:Inter,Arial,sans-serif">
      <h2>Reset your password</h2>
      <p>We received a request to reset your password for <b>${
        process.env.APP_NAME || "your account"
      }</b>.</p>
      <p>This link is valid for <b>15 minutes</b>:</p>
      <p><a href="${resetLink}" style="background:#4f46e5;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Reset Password</a></p>
      <p>or copy & paste: <br/> <code>${resetLink}</code></p>
      <hr/>
      <small>If you didn’t request this, ignore this email.</small>
    </div>
  `;
  await sendEmail({ to: email, subject: "Password reset", html });

  return res.json({ msg: "Email sent" });
}

// POST /api/auth/reset-password/:token
async function resetPassword(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ msg: errors.array()[0].msg });

  const { token } = req.params;
  const { password } = req.body;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

  user.password = password;
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return res.json({ msg: "Password updated successfully" });
}

module.exports = { login, forgotPassword, resetPassword };

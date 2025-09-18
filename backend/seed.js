const { connectDB } = require("./src/config/db");
const User = require("./src/models/User");
module.exports = async function seed() {
  require("dotenv").config();
  await connectDB();
  await User.deleteMany({ email: "rohithowlader2017@gmail.com" });
  await User.create({
    email: "rohithowlader2017@gmail.com",
    password: "123456",
  });
  console.log("seeded -> rohithowlader2017@gmail.com / 123456");
  process.exit();
};

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  googleId: String,
  githubId: String,
  linkedinId: String,
  otp: String,
  otpExpires: Date,
  isVerified: {
    type: Boolean,
    default: false, // Default to false until the user is verified
  },
});

module.exports = mongoose.model("User", UserSchema);


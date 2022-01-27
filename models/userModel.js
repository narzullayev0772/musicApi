const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");

// name email photo password password Confirm;

const UserScema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email error"],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "password required"],
    minlength: 6,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please required pasword confirm"],
    validate: function (el) {
      return el === this.password;
    },
    select: false,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpired: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

UserScema.pre("save", async function (next) {
  // if password modified then run
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

UserScema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

UserScema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

UserScema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

UserScema.methods.changePasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changePasswordTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return changePasswordTimeStamp > jwtTimeStamp;
  }

  return false;
};

UserScema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpired = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", UserScema);

module.exports.User = User;

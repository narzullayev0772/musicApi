const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { User } = require("./../models/userModel");
const AppError = require("../utils/appError");
const catchAsyn = require("../utils/catchAsyn");
const sendEmail = require("../utils/email");

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN_COOKIE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  // hide password
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

module.exports.signup = catchAsyn(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsyn(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("provide your email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect pasword or email", 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsyn(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You're not logged in! please login in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("Your token doesnt exist", 401));
  }

  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("Your token rececntly changed. Please login again", 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("you dont have permission", 403));
    }
    next();
  };
};

exports.deleteUser = catchAsyn(async (req, res) => {
  await User.deleteOne({ _id: req.params.id });
  res.status(201).json({
    status: "deleted",
  });
});

exports.getAllUser = catchAsyn(async (req, res, next) => {
  const allUser = await User.find();
  res.status(200).json({
    status: "success",
    result: allUser.length,
    users: allUser,
  });
});

exports.forgotPassword = catchAsyn(async (req, res, next) => {
  // 1) get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("there is no user with email addres", 404));
  }

  // 2) generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send to email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/forgotpassword/${resetToken}`;

  const message = `Forgot your password? confirmPassword ${resetUrl} check your email `;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your pasword reset token",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "token send to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("Error sending message to email. Try again later", 500)
    );
  }
});
exports.resetPassword = catchAsyn(async (req, res, next) => {
  // get user based token

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });

  // if user not expired set new pasword
  if (!user) {
    return next(new AppError("this token invalid or expired", 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;
  await user.save();

  // update password

  // log user in, send jwt
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsyn(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!user.correctPassword(req.body.currentPassword, user.password)) {
    return next(new AppError("Your current password wrong", 401));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // log user and send jwt

  createSendToken(user, 200, res);
});

exports.updateMe = catchAsyn(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "this route isn't for password update, use /updateMyPassword route"
      ),
      400
    );
  }

  // 2 update user document
  const filtered = filteredObj(req.body, "name", "email"); // permission for only email and name
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filtered, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsyn(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

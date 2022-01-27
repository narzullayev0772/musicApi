const express = require("express");
const {
  signup,
  login,
  protect,
  restrictTo,
  deleteUser,
  getAllUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
} = require("../controller/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);
router.patch("/updateMyPassword", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);

router.delete("/deleteme", protect, deleteMe);

router.get("/", protect, restrictTo("admin"), getAllUser);

router.delete("/:id", protect, restrictTo("admin"), deleteUser);

exports.UserRoute = router;

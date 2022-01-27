const express = require("express");
const { protect } = require("../controller/authController");
const {
  ruMusic,
  udarMusic,
  search,
  turkMusic,
  uzMusic,
  uzMusicPage,
  ruMusicPage,
  udarMusicPage,
  turkMusicPage,
  TopMusic,
  LikeCounter,
} = require("../controller/musicController");

const router = express.Router();

router.post("/", (req, res) => {
  res.status(200).json({
    status: "sucess",
    msg: "you can use my all route",
  });
});

router.patch("/like", LikeCounter);

router.get("/uz", protect, uzMusic);
router.get("/uz/:page", uzMusicPage);

router.get("/ru", ruMusic);
router.get("/ru/:page", ruMusicPage);

router.get("/udar", udarMusic);
router.get("/udar/:page", udarMusicPage);

router.get("/turk", turkMusic);
router.get("/turk/:page", turkMusicPage);

router.post("/search", search);

module.exports = router;

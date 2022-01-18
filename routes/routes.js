const express = require("express");
const {
  trackCreator,
  ruMusic,
  udarMusic,
  search,
  turkMusic,
  uzMusic,
  uzMusicPage,
  ruMusicPage,
  udarMusicPage,
  turkMusicPage,
} = require("../controller/musicController");
const router = express.Router();

router.get("/uz", uzMusic);
router.get("/uz/:page", uzMusicPage);

router.get("/ru", ruMusic);
router.get("/ru/:page", ruMusicPage);

router.get("/udar", udarMusic);
router.get("/udar/:page", udarMusicPage);

router.get("/turk", turkMusic);
router.get("/turk/:page", turkMusicPage);

router.get("/search", search);

module.exports = router;

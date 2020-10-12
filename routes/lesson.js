const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../config/storage");
const upload = multer({ storage: storage });

const { isAuthenticated, isUnAuthenticated } = require("../config/protected");
const {
  getLessons,
  getAddLesson,
  postAddLesson,
  getEditLesson,
  postEditLesson,
  getLessonsList,
  getRincianLesson,
} = require("../controllers/lesson");

router.get("/", isAuthenticated, getLessons);
router.get("/add", isAuthenticated, getAddLesson);
router.get("/edit/:id", isAuthenticated, getEditLesson);
router.get("/delete/:delete", isAuthenticated, postEditLesson);

router.get("/list", isAuthenticated, getLessonsList);
router.get("/rincian/:id", isAuthenticated, getRincianLesson);

/**
 * POST Method
 */

router.post("/add", isAuthenticated, upload.single("thumbnail"), postAddLesson);
router.post(
  "/edit/:id",
  isAuthenticated,
  upload.single("thumbnail"),
  postEditLesson
);

module.exports = router;

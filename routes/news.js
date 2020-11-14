const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../config/storage");
const upload = multer({ storage: storage });

const { isAuthenticated, isUnAuthenticated } = require("../config/protected");
const {
    getNews,
    getAddTool,
    getEditTool,
    postEditTool,
    postAddTool,
    getToolsByCategory,
    getRincianTool,
} = require("../controllers/news");

router.get("/", isAuthenticated, getNews);
router.get("/add", isAuthenticated, getAddTool);
router.get("/edit/:id", isAuthenticated, getEditTool);
router.get("/delete/:delete", isAuthenticated, postEditTool);

router.get("/a/:id", isAuthenticated, getToolsByCategory);
router.get("/rincian/:id", isAuthenticated, getRincianTool);

/**
 * POST Method
 */

router.post("/add", isAuthenticated, upload.single("thumbnail"), postAddTool);
router.post(
    "/edit/:id",
    isAuthenticated,
    upload.single("thumbnail"),
    postEditTool
);

module.exports = router;

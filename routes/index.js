var express = require("express");
var router = express.Router();

const { isAuthenticated } = require("../config/protected");
const { getIndex, getHome, getFreeVideo, getBilling} = require("../controllers/pages");

/**
 * GET Method
 */

router.get("/", getHome);
router.get("/free", getFreeVideo);
router.get("billing", getBilling);
router.get("/dashboard", isAuthenticated, getIndex);

module.exports = router;

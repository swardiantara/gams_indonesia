var express = require("express");
var router = express.Router();

const { isAuthenticated } = require("../config/protected");
const { getIndex, getHome, getFreeVideo, getBilling, postLeads, postBilling } = require("../controllers/pages");

/**
 * GET Method
 */

router.get("/", getHome);
router.get("/freevideo", getFreeVideo);
router.get("/register", getBilling);
router.get("/dashboard", isAuthenticated, getIndex);

/**
 * POST Method
 */
router.post("/freevideo", postLeads);
router.post("/register", postBilling);

module.exports = router;

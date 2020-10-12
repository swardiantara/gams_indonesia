var express = require("express");
var router = express.Router();

const { isAuthenticated } = require("../config/protected");
const { getMemberlist } = require("../controllers/memberlist");

/**
 * GET Method
 */
router.get("/", isAuthenticated, getMemberlist);

module.exports = router;

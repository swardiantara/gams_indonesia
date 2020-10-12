var express = require("express");
var router = express.Router();

const { isAuthenticated } = require("../config/protected");
const { getMyLeads } = require("../controllers/leads");

/**
 * GET Method
 */
router.get("/my", isAuthenticated, getMyLeads);

module.exports = router;

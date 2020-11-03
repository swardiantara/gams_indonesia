var express = require("express");
var router = express.Router();

const { isAuthenticated } = require("../config/protected");
const { getMyLeads, getLeadsPanel } = require("../controllers/leads");

/**
 * GET Method
 */
router.get("/my", isAuthenticated, getMyLeads);
router.get('/panel', isAuthenticated, getLeadsPanel)
module.exports = router;

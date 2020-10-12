var express = require('express');
var router = express.Router();

const { isAuthenticated, isUnAuthenticated } = require('../config/protected');
const { getEdit, postEdit, postEditBank } = require('../controllers/profile');

router.get('/edit', isAuthenticated, getEdit);

/**
 * POST
 */

router.post('/edit', isAuthenticated, postEdit);
router.post('/edit/bank', isAuthenticated, postEditBank);

module.exports = router;

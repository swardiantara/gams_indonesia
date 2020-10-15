var express = require('express');
var router = express.Router();
const multer = require("multer");
const storage = require("../config/storage");
const upload = multer({ storage: storage });

const { isAuthenticated, isUnAuthenticated } = require('../config/protected');
const { getEdit, postEdit, postEditBank } = require('../controllers/profile');

router.get('/edit', isAuthenticated, getEdit);

/**
 * POST
 */

router.post('/edit', isAuthenticated, upload.single('fotoProfile'), postEdit);
router.post('/edit/bank', isAuthenticated, postEditBank);

module.exports = router;

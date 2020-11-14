var express = require('express');
var router = express.Router();
const multer = require("multer");
const storage = require("../config/storage");
const upload = multer({ storage: storage });

const { isAuthenticated, isUnAuthenticated } = require('../config/protected');
const { getEdit, postEdit, postEditBank, getEditSandi, postEditSandi, getUserProfile } = require('../controllers/profile');

router.get('/edit', isAuthenticated, getEdit);
router.get('/:id', isAuthenticated, getUserProfile);
router.get('/edit/sandi', isAuthenticated, getEditSandi);

/**
 * POST
 */

router.post('/edit', isAuthenticated, upload.single('fotoProfile'), postEdit);
router.post('/edit/bank', isAuthenticated, postEditBank);
router.post('/edit/sandi', isAuthenticated, postEditSandi);

module.exports = router;

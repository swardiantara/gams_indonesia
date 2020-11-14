const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../config/storage");
const upload = multer({ storage: storage });

const { isAuthenticated, isUnAuthenticated } = require("../config/protected");
const {
  getMembership,
  getAddMembership,
  getEditMembership,
  postEditMembership,
  postAddMembership,
  getMemberOrder,
  getMembershipAPI,
  postOrderMembership,
  getMemberOrderList,
  getMemberCommission,
  getUploadReceipt,
  postUploadReceipt,
  postVerifikasi,
  getUploadPremium,
  postUploadPremium,
  getCommisionDetail,
  getDownlineDetail,
  resetCommission
} = require("../controllers/membership");

router.get("/", isAuthenticated, getMembership);
router.get("/add", isAuthenticated, getAddMembership);
router.get("/edit/:id", isAuthenticated, getEditMembership);
router.get("/delete/:delete", isAuthenticated, postEditMembership);
router.get("/membercommission", isAuthenticated, getMemberCommission);
router.get("/commission/:id", isAuthenticated, getCommisionDetail);
router.get("/team-member/:id", isAuthenticated, getDownlineDetail);
router.get('/upload-receipt/:id', getUploadReceipt);
router.get('/upload-premium/:id', getUploadPremium);

router.get("/order", getMemberOrder);
router.get("/order/panel", getMemberOrderList);
router.get("/api/list", getMembershipAPI);
router.post('/upload-receipt/:id', upload.single('buktiBayar'), postUploadReceipt);
router.post('/upload-premium/:id', upload.single('buktiBayar'), postUploadPremium);
router.post('/verifikasi/:id', postVerifikasi);
router.post('/verifikasi-premium/:id', postVerifikasi);
router.post("/commission/:id/reset", isAuthenticated, resetCommission);


/**
 * POST Method
 */

router.post("/add", isAuthenticated, postAddMembership);
router.post("/edit/:id", isAuthenticated, postEditMembership);
router.post("/api/order", postOrderMembership);

module.exports = router;

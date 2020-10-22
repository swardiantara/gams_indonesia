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
  postUploadReceipt
} = require("../controllers/membership");

router.get("/", isAuthenticated, getMembership);
router.get("/add", isAuthenticated, getAddMembership);
router.get("/edit/:id", isAuthenticated, getEditMembership);
router.get("/delete/:delete", isAuthenticated, postEditMembership);
router.get("/membercommission", isAuthenticated, getMemberCommission);
router.get('/upload-receipt/:id', getUploadReceipt);

router.get("/order", getMemberOrder);
router.get("/order/panel", getMemberOrderList);
router.get("/api/list", getMembershipAPI);
router.post('/upload-receipt/:id', upload.single('buktiBayar'), postUploadReceipt);


/**
 * POST Method
 */

router.post("/add", isAuthenticated, postAddMembership);
router.post("/edit/:id", isAuthenticated, postEditMembership);
router.post("/api/order", postOrderMembership);

module.exports = router;

const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../config/storage");
const upload = multer({ storage: storage });

const { isAuthenticated, isUnAuthenticated } = require("../config/protected");
const {
  getProducts,
  getAddProduct,
  postProduct,
  getEditProduct,
  postEditProduct,
  getUserProduct,
  getUserProductDetails,
  getUserCart,
  postCart,
  getProvinces,
  getCartAPI,
  getShipping,
  postOrderDetails,
  getOrderStatus,
  getOrderDetails,
  getOrderDetailsAPI,
  payOrder,
  getOrderSalesPanel,
} = require("../controllers/product");

router.get("/", isAuthenticated, getProducts);
router.get("/add", isAuthenticated, getAddProduct);
router.get("/edit/:id", isAuthenticated, getEditProduct);
router.get("/delete/:delete", isAuthenticated, postEditProduct);
router.get("/catalog", isAuthenticated, getUserProduct);
router.get("/catalog/:id", isAuthenticated, getUserProductDetails);

router.get("/cart", isAuthenticated, getUserCart);
router.get("/order-status", getOrderStatus);
router.get("/order-status/panel", getOrderSalesPanel);
router.get("/order-details/:id", getOrderDetails);

/**
 * POST Method
 */

router.post("/add", isAuthenticated, upload.array("gallery"), postProduct);
router.post(
  "/edit/:id",
  isAuthenticated,
  upload.array("gallery", 5),
  postEditProduct
);

router.post("/catalog/:prodId", postCart);

/**
 * API
 */

router.get("/api/cart", getCartAPI);
router.get("/api/provinces", getProvinces);
router.get("/api/shipping", getShipping);
router.get("/order-details/:id/api", getOrderDetailsAPI);

router.post("/api/neworder", postOrderDetails);
router.post("/order-details/:id/api", payOrder);

module.exports = router;

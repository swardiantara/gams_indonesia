const Router = require("express");
const multer = require("multer");
const storage = require("../config/storage");
const upload = multer({ storage: storage });
const { isAuthenticated } = require("../config/protected");

const {
  editDashboard,
  postDashboard,
  getDashboard,
} = require("../controllers/edit-dashboard");

const router = Router();

router.get("/", isAuthenticated, editDashboard);
router.get("/dashboard", isAuthenticated, getDashboard);
router.get("/dashboard-admin", isAuthenticated, getDashboard);
router.post("/", isAuthenticated, upload.single("thumbnail"), postDashboard);

module.exports = router;

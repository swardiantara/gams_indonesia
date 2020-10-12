const Router = require("express");
const { isAuthenticated } = require("../config/protected");

const {
  editDashboard,
  postDashboard,
  getDashboard,
} = require("../controllers/edit-dashboard");

const router = Router();

router.get("/", isAuthenticated, editDashboard);
router.get("/dashboard", isAuthenticated, getDashboard);
router.post("/", isAuthenticated, postDashboard);

module.exports = router;

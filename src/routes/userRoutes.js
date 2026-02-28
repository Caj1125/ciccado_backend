const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const { ROLES } = require("../utils/constants");

// All user management routes require admin
router.use(protect, authorize(ROLES.ADMIN));

router.route("/").get(getUsers);
router.route("/:id").get(getUserById).delete(deleteUser);
router.put("/:id/role", updateUserRole);

module.exports = router;

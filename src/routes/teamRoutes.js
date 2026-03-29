const express = require("express");
const router = express.Router();
const {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
} = require("../controllers/teamController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const { ROLES } = require("../utils/constants");

// All team routes require authentication
router.use(protect);

router
  .route("/")
  .post(authorize(ROLES.ADMIN, ROLES.MANAGER), createTeam)
  .get(getTeams);

router
  .route("/:id")
  .get(getTeamById)
  .put(authorize(ROLES.ADMIN, ROLES.MANAGER), updateTeam);

module.exports = router;

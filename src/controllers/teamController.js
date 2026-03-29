const Team = require("../models/Team");
const User = require("../models/User");

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private (Admin, Manager)
const createTeam = async (req, res, next) => {
  try {
    const { name, members, developers, testers } = req.body;

    if (!developers || developers.length === 0) {
      res.status(400);
      throw new Error("Team must have at least one developer");
    }

    if (!testers || testers.length === 0) {
      res.status(400);
      throw new Error("Team must have at least one tester");
    }

    // Validate that developers are actual developers
    const devUsers = await User.find({
      _id: { $in: developers },
      role: "developer",
    });
    if (devUsers.length !== developers.length) {
      res.status(400);
      throw new Error(
        "All users listed as developers must have the 'developer' role"
      );
    }

    // Validate that testers are actual testers
    const testerUsers = await User.find({
      _id: { $in: testers },
      role: "tester",
    });
    if (testerUsers.length !== testers.length) {
      res.status(400);
      throw new Error(
        "All users listed as testers must have the 'tester' role"
      );
    }

    // Build members as the union of developers + testers + any extra members
    const allMemberIds = [
      ...new Set([
        ...(members || []),
        ...developers,
        ...testers,
      ]),
    ];

    const team = await Team.create({
      name,
      members: allMemberIds,
      developers,
      testers,
      createdBy: req.user._id,
    });

    const populatedTeam = await Team.findById(team._id)
      .populate("members", "name email role")
      .populate("developers", "name email role")
      .populate("testers", "name email role")
      .populate("createdBy", "name email");

    res.status(201).json(populatedTeam);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find()
      .populate("members", "name email role")
      .populate("developers", "name email role")
      .populate("testers", "name email role")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(teams);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team by ID
// @route   GET /api/teams/:id
// @access  Private
const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("members", "name email role")
      .populate("developers", "name email role")
      .populate("testers", "name email role")
      .populate("createdBy", "name email");

    if (!team) {
      res.status(404);
      throw new Error("Team not found");
    }

    res.json(team);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a team (members, developers, testers)
// @route   PUT /api/teams/:id
// @access  Private (Admin, Manager)
const updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(404);
      throw new Error("Team not found");
    }

    const { name, members, developers, testers } = req.body;

    // If developers are being updated, validate
    if (developers !== undefined) {
      if (developers.length === 0) {
        res.status(400);
        throw new Error("Team must have at least one developer");
      }
      const devUsers = await User.find({
        _id: { $in: developers },
        role: "developer",
      });
      if (devUsers.length !== developers.length) {
        res.status(400);
        throw new Error(
          "All users listed as developers must have the 'developer' role"
        );
      }
    }

    // If testers are being updated, validate
    if (testers !== undefined) {
      if (testers.length === 0) {
        res.status(400);
        throw new Error("Team must have at least one tester");
      }
      const testerUsers = await User.find({
        _id: { $in: testers },
        role: "tester",
      });
      if (testerUsers.length !== testers.length) {
        res.status(400);
        throw new Error(
          "All users listed as testers must have the 'tester' role"
        );
      }
    }

    const finalDevs = developers !== undefined ? developers : team.developers;
    const finalTesters = testers !== undefined ? testers : team.testers;
    const extraMembers = members !== undefined ? members : [];

    const allMemberIds = [
      ...new Set([
        ...extraMembers.map(String),
        ...finalDevs.map(String),
        ...finalTesters.map(String),
      ]),
    ];

    if (name !== undefined) team.name = name;
    team.members = allMemberIds;
    team.developers = finalDevs;
    team.testers = finalTesters;

    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate("members", "name email role")
      .populate("developers", "name email role")
      .populate("testers", "name email role")
      .populate("createdBy", "name email");

    res.json(populatedTeam);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
};

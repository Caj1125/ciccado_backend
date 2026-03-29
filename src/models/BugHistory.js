const mongoose = require("mongoose");

const bugHistorySchema = new mongoose.Schema({
  bug: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bug",
    required: true,
    index: true,
  },
  action: {
    type: String,
    required: true,
    enum: ["created", "assigned_team", "status_change", "updated"],
  },
  detail: {
    type: String,
    default: "",
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BugHistory", bugHistorySchema);

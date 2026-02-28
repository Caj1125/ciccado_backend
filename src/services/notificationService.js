/**
 * Notification service placeholder.
 * Extend with email (nodemailer), Slack webhooks, or push notifications as needed.
 */

const notifyBugAssigned = async ({ bug, assignedTo }) => {
  // TODO: integrate real notification channel (email / Slack / websocket)
  console.log(
    `[Notification] Bug "${bug.title}" assigned to user ${assignedTo}`
  );
};

const notifyStatusChange = async ({ bug, oldStatus, newStatus }) => {
  console.log(
    `[Notification] Bug "${bug.title}" status changed from ${oldStatus} to ${newStatus}`
  );
};

module.exports = {
  notifyBugAssigned,
  notifyStatusChange,
};

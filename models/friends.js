const mongoose = require("mongoose");

const friendsSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  friendsList: { type: Array },
  pendingRequest: { type: Array},
  recievedRequest: { type: Array }
});

module.exports = mongoose.model("friends", friendsSchema);
const mongoose = require("mongoose");

const eventManagerSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model("EventManager", eventManagerSchema);
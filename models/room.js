const mongoose = require("mongoose");

const roomsSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  roomsList: { type: Array }
});

module.exports = mongoose.model("rooms", roomsSchema);
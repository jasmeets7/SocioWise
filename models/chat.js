const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  conversation: { type: Array }
});
 
module.exports = mongoose.model("chat", chatSchema);
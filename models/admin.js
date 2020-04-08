const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model("Admin", adminSchema);
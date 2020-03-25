const mongoose = require("mongoose");

const professorSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model("Professor", professorSchema);
const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  programName: { type: String, required: true }
});

module.exports = mongoose.model("Student", studentSchema);
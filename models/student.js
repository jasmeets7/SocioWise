const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  programName: { type: String, required: true },
  semester: { type: String, default: "" },
  campus: { type: String, default: "" },
  internationalStudent: { type: String, default: "" }
});

module.exports = mongoose.model("Student", studentSchema);
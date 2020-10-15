const mongoose = require("mongoose");

const programSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  programName: { type: String, required: true }
});

module.exports = mongoose.model("programs", programSchema);
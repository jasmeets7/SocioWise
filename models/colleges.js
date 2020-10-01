const mongoose = require("mongoose");

const collegeSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  url: { type: String, required: true }
});

module.exports = mongoose.model("colleges", collegeSchema);
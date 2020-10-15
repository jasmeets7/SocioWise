const Programs = require("../models/programs");

exports.getPrograms = (req, res, next) => {
    Programs.find({}).then(result => {
        if (!result) {
            return res.status(401).json({
                message: "No Programs Available"
            });
        }
        const programsList = result;
        res.status(200).json({
            programsList : programsList
        });
    });
}
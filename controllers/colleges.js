const Colleges = require("../models/colleges");

exports.getColleges = (req, res, next) => {
    Colleges.find({}).then(result => {
        if (!result) {
            return res.status(401).json({
                message: "No College Available"
            });
        }
        const collegeList = result;
        res.status(200).json({
            collegeList : collegeList
        });
    });
}
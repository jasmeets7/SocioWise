const Colleges = require("../models/colleges");

exports.getColleges = (req, res, next) => {
    Colleges.find({}).then(result => {
        if (!result) {
            return res.status(401).json({
                message: "Incorrect E-Mail or Password"
            });
        }
        const collegeList = result;
        res.status(200).json({
            collegeList : collegeList
        });
    });
}
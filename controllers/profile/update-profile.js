const User = require("../../models/user");
const Student = require("../../models/student");

exports.updateSchoolInfo = (req, res, next) => {

    const id = req.body.id;

    const student = new Student({
        _id: id,
        semester: req.body.Semester,
        campus: req.body.Campus,
        internationalStudent: req.body.StudentStatus
    });

    const updatedData = {
        semester: req.body.Semester,
        campus: req.body.Campus,
        internationalStudent: req.body.StudentStatus
    }

    Student.updateOne({ _id: id }, student).then((result)=>{
        res.status(201).json({
            message: "Profile Updated Sucessfully!!",
            result: result,
            updatedData: updatedData
        });
    }).catch(err => {
        res.status(400).json({
            message: err
        });
    });
    
}


exports.updatePersonalInfo = (req, res, next) => {

    const id = req.body.id;

    if (req.body.firstName === "" || req.body.lastName === "") {
        return res.status(401).json({
            message: "Please give a valid First Name and Last Name"
        });
    }

    const user = new User({
        _id: id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        personalInfo: {
            phoneNumber: req.body.phoneNumber,
            nativeLanguage: req.body.nativeLanguage,
            secondLanguage: req.body.secondLanguage
        },
        active: true
    });

    const updatedData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        personalInfo: {
            phoneNumber: req.body.phoneNumber,
            nativeLanguage: req.body.nativeLanguage,
            secondLanguage: req.body.secondLanguage
        }
    }

    User.updateOne({ _id: id }, user).then((result)=>{
        res.status(201).json({
            message: "Profile Updated Sucessfully!!",
            result: result,
            updatedData: updatedData
        });
    }).catch(err => {
        res.status(400).json({
            message: err
        });
    });

}
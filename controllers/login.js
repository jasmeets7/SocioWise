const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Student = require("../models/student");

exports.userLogIn = (req, res, next) => {

    const url = req.protocol + "://" + req.get("host");
    let imagePath = url + "/images/default.png";

    let fetchedUser;
    let userType;

    let studentData;

    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({
            message: "Incorrect E-Mail or Password"
        });
        } else if (!user.active) {
                return res.status(401).json({
                message: "You need to Verify your Email"
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(async result => {
        if (!result) {
            return res.status(401).json({ message: "Incorrect E-Mail or Password"});
        }

        switch(fetchedUser.userType) {
            case "0":
                userType = "116567";
                break;
            case "1":
                userType = "990196";
                studentData = await Student.findOne({ _id : fetchedUser._id });
                break;
            case "2":
                userType = "426634";
                break;
            case "3":
                userType = "334793";
                break;
            default:
                userType = "186173";
                break;
        }

        if (fetchedUser.imagePath === "") {
            fetchedUser.imagePath = imagePath;
        } else {
            fetchedUser.imagePath = url + fetchedUser.imagePath;
        }

        const userDetails = {
            id: fetchedUser._id,
            firstName : fetchedUser.firstName,
            lastName : fetchedUser.lastName,
            email : fetchedUser.email,
            collegeID : fetchedUser.collegeID,
            active: fetchedUser.active,
            uTV: userType,
            imagePath: fetchedUser.imagePath,
            personalInfo: {
                phoneNumber: fetchedUser.personalInfo.phoneNumber,
                nativeLanguage: fetchedUser.personalInfo.nativeLanguage,
                secondLanguage:  fetchedUser.personalInfo.secondLanguage
            },
            studentData: studentData
        }

        const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userDetails: userDetails
        });

    })
}
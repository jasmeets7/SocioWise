const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Student = require("../models/student");

const Programs = require("../models/programs");
const { env } = require("process");

exports.userLogIn = (req, res, next) => {

    const url = "https://" + req.get("host");
    let imagePath = url + "/images/default.png";

    let fetchedUser;
    let userType;

    let studentData;

    let programName;
    let programID;
    let collegeID;

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
            case process.env.BASE_ADMIN:
                userType = process.env.ADMIN;
                break;
            case process.env.BASE_STUDENT:
                userType =  process.env.STUDENT; 
                studentData = await Student.findOne({ _id : fetchedUser._id });
                programName = await Programs.findOne({_id: studentData.programName});
                programID = studentData.programName;
                studentData.programName = programName.programName;
                break;
            case process.env.BASE_PROFESSOR:
                userType =  process.env.PROFESSOR;
                break;
            case process.env.BASE_EVENTMANAGER:
                userType =  process.env.EVENT_MANAGER;
                break;
            default:
                userType =  process.env.UNKNOWN;
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

        collegeID = fetchedUser.collegeId;

        const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userDetails: userDetails,
            programId: programID,
            collegeID: collegeID
        });

    })
}
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Student = require("../models/students");
const Professor = require("../models/professor");
const EventManager = require("../models/event-manager");
const Admin = require("../models/admin");

exports.userLogIn = (req, res, next) => {
    let fetchedUser;
    let userType;
    let userObj;
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
    })
    .then(async result => {
        if (!result) {
            return res.status(401).json({ message: "Incorrect E-Mail or Password"});
        }
        let isStudent = await Student.exists({_id: fetchedUser._id});
        if (!isStudent) {
            let isProfessor =  await Professor.exists({_id: fetchedUser._id});
            if (!isProfessor) {
                let isEventManager =  await EventManager.exists({_id: fetchedUser._id});
                if (!isEventManager) {
                    let isAdmin =  await Admin.exists({_id: fetchedUser._id});
                    if (isAdmin) {
                        let adminObj =  await Admin.findOne({_id: fetchedUser._id});
                        userType = "Admin";
                        userObj = adminObj;
                    }
                }else{
                let eventManagerObj =  await EventManager.findOne({_id: fetchedUser._id});
                userType = "Event Manager";
                userObj = eventManagerObj;
                }
            } else{
                let professorObj =  await Professor.findOne({_id: fetchedUser._id});
                userType = "Professor";
                userObj = professorObj;
            }
        }else{
            let studentObj =  await Student.findOne({_id: fetchedUser._id});
            userType = "Student";
            userObj = studentObj;
        }
        const userDetails = {
            firstName : fetchedUser.firstName,
            lastName : fetchedUser.lastName,
            email : fetchedUser.email
        }
        const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userType: userType,
            userObj: userObj,
            userDetails: userDetails
        });
    })
    .catch(err => {
        return res.status(401).json({
            message: "Incorrect E-Mail or Password"
        });
    });
}
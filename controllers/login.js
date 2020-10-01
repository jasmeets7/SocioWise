const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.userLogIn = (req, res, next) => {
    let fetchedUser;
    let userType;
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
    }).then(result => {
        if (!result) {
            return res.status(401).json({ message: "Incorrect E-Mail or Password"});
        }

        switch(fetchedUser.userType) {
            case "0":
                userType = "116567";
                break;
            case "1":
                userType = "990196";
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

        const userDetails = {
            id: fetchedUser._id,
            firstName : fetchedUser.firstName,
            lastName : fetchedUser.lastName,
            email : fetchedUser.email,
            collegeID : fetchedUser.collegeID,
            active: fetchedUser.active,
            uTV: userType
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
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Student = require("../models/student");
const nodemailer = require("nodemailer");

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

exports.createUser = (req, res, next) => {

    User.findOne({ email: req.body.email}).then((result)=>{
        if (!result) {
            const url = "https://" + req.get("host");
            let imagePath = "/images/default.png";

            const myOAuth2Client = new OAuth2(
                process.env.CLIENTID,
                process.env.CLIENTSECRET,
            );

            myOAuth2Client.setCredentials({
                refresh_token: process.env.REFRESHTOKEN
            });

            const myAccessToken = myOAuth2Client.getAccessToken();

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: "wisesocio@gmail.com",
                    clientId: process.env.CLIENTID,
                    clientSecret: process.env.CLIENTSECRET,
                    refreshToken: process.env.REFRESHTOKEN,
                    accessToken: myAccessToken
                }});

            bcrypt.hash(req.body.password, 10).then(hash => {
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash,
                    collegeId: req.body.collegeId,
                    imagePath: imagePath,
                    personalInfo: {
                        phoneNumber: "",
                        nativeLanguage: "",
                        secondLanguage: ""
                    },
                    userType: "1",
                    active: false
                });
                user.save().then( async result => {
                    const student = new Student({
                        _id: result._id,
                        programName: req.body.programName
                    });
                    student.save().then(result => {
                        console.log(result);
                    });
                    userDels = {
                        _id: result._id,
                    };
                    await jwt.sign(
                        {
                            user: userDels,
                        },
                        process.env.EMAIL_SECRET,
                        {
                            expiresIn: '1d',
                        },
                        (err, emailToken) => {
                            const url = process.env.CONFIRM_URL + `/${emailToken}`;
                
                            transporter.sendMail({
                            to: result.email,
                            subject: 'Confirm Email',
                            html: `Please click this email to confirm your email: <a href="${url}">Click Here</a>`,
                            });

                            console.log(err);
                        }
                    );
                    res.status(201).json({
                        message: "User created!",
                        result: result
                    });
                })
            });
        } else {
            return res.status(401).json({
                message: "User Already Exist!!"
            });
        }
    })

}
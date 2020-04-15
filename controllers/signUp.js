const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Student = require("../models/students");
const nodemailer = require("nodemailer");

const TOKE = "asdf1093KMnzxcvnkljvasdu09123nlasdasdf";

exports.createUser = (req, res, next) => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: "wisesocio",
            pass: "Singh@123",
        },
    });

    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            collegeId: req.body.collegeId
        });
        user
        .save()
        .then(async result => {
            const student = new Student({
                _id: result._id,
                programName: req.body.programName,
                semester: "5"
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
                "asdf1093KMnzxcvnkljvasdu09123nlasdasdf",
                {
                    expiresIn: '1d',
                },
                (err, emailToken) => {
                    const url = `http://localhost:4200/auth/confirmation/${emailToken}`;
        
                    transporter.sendMail({
                    to: result.email,
                    subject: 'Confirm Email',
                    html: `Please click this email to confirm your email: <a href="${url}">Click Here</a>`,
                    });
                }
            );
            res.status(201).json({
                message: "User created!",
                result: result
            });
        })
    });

    

    
}

exports.confirmToken = (req, res, next) => {
    try{    
        const token = req.body.token;
        const v = jwt.verify(token,  TOKE);
        const user = new User({
            _id: v.user._id,
            active:true
        });
        User.update({ _id: v.user._id }, user).then((result)=>{
            res.status(200).json({
                message: "Congratulations your account is verified now proceed to Log-in to use our website!"
            });
        });
    } catch(e){
        res.status(400).json({
            message: "Invalid URL"
        });
        console.log("Invalid URL")
    }
}
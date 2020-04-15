const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const EventManager = require("../models/event-manager");
const Professor = require("../models/professor");
const nodemailer = require("nodemailer");

exports.createEventManager = (req, res, next) => {
    GMAIL_USER = "wisesocio";
    GMAIL_PASS = "Singh@123";

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS,
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
            const student = new EventManager({
                _id: result._id
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
                    const url = `https://sociowise.herokuapp.com/auth/confirmation/${emailToken}`;
        
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

exports.createProfessor = (req, res, next) => {
    GMAIL_USER = "wisesocio";
    GMAIL_PASS = "Singh@123";

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS,
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
            const student = new Professor({
                _id: result._id
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
                    const url = `https://sociowise.herokuapp.com/auth/confirmation/${emailToken}`;
        
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
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.confirmToken = (req, res, next) => {
    try{
        const token = req.body.token;
        const v = jwt.verify(token,  process.env.EMAIL_SECRET);
        const user = new User({
            _id: v.user._id,
            active:true
        });
        User.update({ _id: v.user._id }, user).then((result)=>{
            res.status(200).json({
                message: "Congratulations your account is verified now proceed to Log-in to use our website!"
            });
        });
    }
    catch(e){
        res.status(400).json({
            message: "Invalid URL"
        });
        console.log("Invalid URL")
    }
}
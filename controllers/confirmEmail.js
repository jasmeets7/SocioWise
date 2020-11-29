const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Friends = require("../models/friends");

exports.confirmToken = (req, res, next) => {
    try{
        const token = req.body.token;
        const v = jwt.verify(token,  process.env.EMAIL_SECRET);
        const user = new User({
            _id: v.user._id,
            active:true
        });
        User.update({ _id: v.user._id }, user).then((result)=>{
            generateFriendsList(v.user._id)
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

let generateFriendsList = (userID) => {
    Friends.findOne({ _id: userID}).then((result)=>{
        if (!result) {
            const friends = new Friends({
                _id: userID,
                friendsList: [],
                recievedRequest: [],
                pendingRequest: []
            });
            friends.save().then(result => {
                console.log(result)
            }).catch(err => {
                res.status(400).json({
                    message: err
                });
            });
        }
    })
}
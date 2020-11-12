const Room = require("../../models/room");

exports.getRoom = (req, res, next) => {

    let profileID = req.body.profileID;

    let userID = req.body.userId;

    Room.findOne({ _id: userID},{ roomsList: { $elemMatch: { userID: profileID }}}).then((result)=>{
        res.status(201).json({
            result: result,
            profileID: profileID,
            userID: userID
        });
    }).catch(err => {
        res.status(400).json({
            message: err
        });
    });
}
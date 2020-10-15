const Friends = require("../../models/friends");

exports.rejectRequest = (req, res, next) => {

    let profileID = req.body.profileID;

    let userID = req.body.userId;

    Friends.updateOne({ _id: userID }, {$pull: { recievedRequest: profileID }}).then((result)=>{
        Friends.updateOne({ _id: profileID },  {$pull: { pendingRequest: userID }}).then((result)=>{
            res.status(201).json({
                message: "Friend request rejected sucessfully!!",
                profileID: profileID,
                userID: userID,
                result: result
            });
        }).catch(err => {
            res.status(400).json({
                message: err
            });
        });
    });
}

exports.acceptRequest = (req, res, next) => {

    let profileID = req.body.profileID;

    let userID = req.body.userId;

    Friends.updateOne({ _id: userID }, {$pull: { recievedRequest: profileID }}).then((result)=>{
        Friends.updateOne({ _id: userID }, {$push: { friendsList: profileID }}).then((result)=>{
            Friends.updateOne({ _id: profileID },  {$pull: { pendingRequest: userID }}).then((result)=>{
                Friends.updateOne({ _id: profileID },  {$push: { friendsList: userID }}).then((result)=>{
                    res.status(201).json({
                        message: "Friend request accepted sucessfully!!",
                        profileID: profileID,
                        userID: userID,
                        result: result
                    });
                }).catch(err => {
                    res.status(400).json({
                        message: err
                    });
                });
            });
        });
    });
}

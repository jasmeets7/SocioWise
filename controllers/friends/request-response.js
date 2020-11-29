const Friends = require("../../models/friends");
const Room = require("../../models/room");
const Chat = require("../../models/chat");

const mongoose = require("mongoose");

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
                    let roomID = new mongoose.Types.ObjectId().toString();
                    makeRoom(userID, profileID, roomID);
                    makeRoom(profileID, userID, roomID);
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

let makeRoom = (userID, profileID, roomID) => {
    Room.findOne({ _id: userID }).then((result)=>{
        if (!result) {
            const room = new Room({
                _id: userID,
                roomsList: [
                    {
                        roomID : roomID,
                        userID: profileID
                    }
                ]
            });
            room.save().then(result => {
                makeChat(roomID);
                console.log(result);
            });
        } else {
            Room.updateOne({ _id: userID }, {$push: { roomsList: {roomID : roomID, userID: profileID} }}).then((result)=>{
                makeChat(roomID);
                console.log(result);
            });
        }
    });
}

let makeChat = (room) => {
    Chat.findOne({ _id: room}).then((result)=>{
        if (!result) {
            const chat = new Chat({
                _id: room,
                conversation: []
            });
            chat.save().then(result => { });
        }else {
            //
        }
    })
}
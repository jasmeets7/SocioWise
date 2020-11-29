const Chat = require("../../models/chat");

const mongoose = require("mongoose");

exports.sendMessage = (req, res, next) => {

    let messageID =  req.body.messageID;

    let user = req.body.user;

    let username = req.body.username;

    let room = req.body.room;

    let message = req.body.message;

    let time = req.body.time;

    if (message === undefined || message === "" || message === null) {
        return res.status(401).json({
            message: "Enter some value before sending message"
        });
    }

    Chat.findOne({ _id: room}).then((result)=>{
        if (!result) {
            const chat = new Chat({
                _id: room,
                conversation: [
                    {
                        messageID : messageID,
                        user : user,
                        username : username,
                        message : message,
                        time: time
                    }
                ]
            });
            chat.save().then(result => {
                res.status(201).json({
                    result: result
                });
            }).catch(err => {
                res.status(400).json({
                    message: err
                });
            });
        } else {
            Chat.updateOne({ _id: room }, {$push: { conversation: { messageID : messageID, user : user, username : username, message : message, time: time } }}).then((result)=>{
                // console.log(result);
            });
        }
    });

}

exports.getMessages = (req, res, next) => {

    let room = req.body.room;

    Chat.findOne({ _id: room}).then((result)=>{
        if (!result) {
            return res.status(401).json({
                message: "Wrong URL!!"
            });
        }

        res.status(200).json({
            result: result
        });
    })

}

exports.deleteMessage = (req, res, next) => {

    let room = req.body.room;

    let messageID = req.body.messageID;

    Chat.updateOne({ _id: room }, {$pull: { conversation: { messageID : messageID } }}).then((result)=>{
        
    });

}
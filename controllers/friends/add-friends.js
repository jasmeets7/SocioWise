const Friends = require("../../models/friends");

const User = require("../../models/user");
const Student = require("../../models/student");

const paginate = require("paginate-array");

exports.addFriend = async (req, res, next) => {

    let profileID = req.body.profileID;

    let userID = req.body.userId;

    let profileArray  = await Friends.findOne({ _id: profileID });

    let userArray  = await Friends.findOne({ _id: userID });

    const friends = new Friends({
        _id: userID,
        friendsList: [
            ...userArray.friendsList
        ],
        recievedRequest: [
            ...userArray.recievedRequest
        ],
        pendingRequest: [
            ...userArray.pendingRequest,
            profileID
        ]
    });

    Friends.updateOne({ _id: userID }, friends).then((result)=>{

        const friends = new Friends({
            _id: profileID,
            friendsList: [
                ...profileArray.friendsList
            ],
            recievedRequest: [
                ...profileArray.recievedRequest,
                userID
            ],
            pendingRequest: [
                ...profileArray.pendingRequest
            ]
        });
        Friends.updateOne({ _id: profileID }, friends).then((result)=>{
            res.status(201).json({
                message: "Friend request sent sucessfully!!",
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

exports.getResponseList = async (req, res, next) => {
    let userID = req.body.userId;
    const url = "https://" + req.get("host");

    let profilesArray  = await Friends.findOne({ _id: userID });

    let userArray = await User.find({_id: {$in : profilesArray.recievedRequest}});
    let studentArray = await Student.find({_id: {$in : profilesArray.recievedRequest}});

    if (!userArray) {
        return res.status(401).json({
            message: "No Profiles Available"
        });
    }

    let users = [];

    for (let index = 0; index < userArray.length; index++) {
        users[index] = {
            ...userArray[index]._doc,
            studentData : {
                ...studentArray[index]._doc
            }
        };
        users[index].imagePath = url + users[index].imagePath;
        delete users[index].password;
    }
    const paginateCollection = paginate(users, req.body.pageNo, 5);

    res.status(201).json({
        profiles: paginateCollection
    });
}
const paginate = require("paginate-array");

const Friends = require("../../models/friends");

const User = require("../../models/user");
const Student = require("../../models/student");

exports.getList = (req, res, next) => {

    let userID = req.body.userId;

    const url = "https://" + req.get("host");

    let userArray = [];

    let studentArray = [];

    Friends.findOne({ _id: userID }).then(async (result)=>{
        userArray = await User.find({_id:{$in: result.friendsList}});
        studentArray = await Student.find({_id: {$in : result.friendsList}});

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

    });

}

exports.unfriendUser = (req, res, next) => {
    let profileID = req.body.profileID;

    let userID = req.body.userId;

    Friends.updateOne({ _id: userID }, {$pull: { friendsList: profileID }}).then((result)=>{
        Friends.updateOne({ _id: profileID },  {$pull: { friendsList: userID }}).then((result)=>{
            res.status(201).json({
                message: "Unfriended sucessfully!!",
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
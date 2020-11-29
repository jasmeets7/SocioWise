const paginate = require("paginate-array");

const User = require("../../models/user");
const Student = require("../../models/student");
const Friends = require("../../models/friends");

exports.getProfiles = async (req, res, next) => {
    let pros = [];
    let studentData;
    let newRes = {};
    const url = "https://" + req.get("host");
    let userArray  = await Friends.findOne({ _id: req.body.userId });

    if (userArray == null) {
        userArray = {
            pendingRequest: [],
            recievedRequest: [],
            friendsList: []
        };
    }

    User.find({collegeId: req.body.cid, userType: "1"}).where({$and: [{_id:{$ne : req.body.userId}}, {_id : {$nin : userArray.pendingRequest}}, {_id : {$nin : userArray.recievedRequest}}, {_id : {$nin : userArray.friendsList}}]}).then(async result => {
        if (!result) {
            return res.status(401).json({
                message: "No Profiles Available"
            });
        }

        studentData = await Student.find({programName: req.body.pid});

        for (let index1 = 0; index1 < result.length; index1++) {
            for (let index = 0; index < studentData.length; index++) {
                if(result[index1]._id.toString() === studentData[index]._id.toString()){
                    newRes = {
                        ...result[index1]._doc,
                        studentData: studentData[index]
                    }
                    newRes.imagePath = url + newRes.imagePath;
                    delete newRes.password;
                    pros.push(newRes);

                }
            }
        }
        const profiles = result;
        const paginateCollection = paginate(pros, req.body.pageNumber, 5);
        res.status(200).json({
            profiles : paginateCollection
        });
    });

}
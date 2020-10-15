const express = require("express");

const multer = require("multer");

const collegeController = require("../controllers/colleges");

const programsController = require("../controllers/programs");

const loginController = require("../controllers/login");

const studentSignUpController = require("../controllers/studentSignUp");

const confirmEmailController = require("../controllers/confirmEmail");

const updateImageController = require("../controllers/profile/update-image");

const employeeSignUpController = require("../controllers/employeeSignUp");

const profileUpdateController = require("../controllers/profile/update-profile");

const friendsProfileController = require("../controllers/friends/get-profiles");

const addFriendsController = require("../controllers/friends/add-friends");

const requestResponseController = require("../controllers/friends/request-response");

const pendingRequestController = require("../controllers/friends/pending-request");

const friendsListController = require("../controllers/friends/friends-list");

const router = express.Router();

router.get("/collegeList", collegeController.getColleges);

router.get("/programsList", programsController.getPrograms);

router.post("/login", loginController.userLogIn);

router.post("/signup", studentSignUpController.createUser);

router.put("/confirmToken", confirmEmailController.confirmToken);

router.post("/professorSignup", employeeSignUpController.createProfessor);

router.post("/eventManagerSignup", employeeSignUpController.createEventManager);

router.put("/updateImage", multer({ storage: updateImageController.storage }).single("image"), updateImageController.updateImage);

router.put("/updatePersonalInfo", profileUpdateController.updatePersonalInfo);

router.put("/updateSchoolInfo", profileUpdateController.updateSchoolInfo);

router.post("/getProfiles", friendsProfileController.getProfiles);

router.put("/addFriend", addFriendsController.addFriend);

router.post("/getResponseList", addFriendsController.getResponseList);

router.put("/rejectRequest", requestResponseController.rejectRequest);

router.put("/acceptRequest", requestResponseController.acceptRequest);

router.post("/getPendingList", pendingRequestController.getPendingList);

router.put("/cancelRequest", pendingRequestController.cancelRequest);

router.post("/getFriendsList", friendsListController.getList);

router.put("/unfriendUser", friendsListController.unfriendUser);

module.exports = router;

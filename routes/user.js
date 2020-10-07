const express = require("express");

const multer = require("multer");

const collegeController = require("../controllers/colleges");

const loginController = require("../controllers/login");

const studentSignUpController = require("../controllers/studentSignUp");

const confirmEmailController = require("../controllers/confirmEmail");

const updateImageController = require("../controllers/profile/update-image");

const employeeSignUpController = require("../controllers/employeeSignUp");

const profileUpdateController = require("../controllers/profile/update-profile");

const router = express.Router();

router.get("/collegeList", collegeController.getColleges);

router.post("/login", loginController.userLogIn);

router.post("/signup", studentSignUpController.createUser);

router.put("/confirmToken", confirmEmailController.confirmToken);

router.post("/professorSignup", employeeSignUpController.createProfessor);

router.post("/eventManagerSignup", employeeSignUpController.createEventManager);

router.put("/updateImage", multer({ storage: updateImageController.storage }).single("image"), updateImageController.updateImage);

router.put("/updatePersonalInfo", profileUpdateController.updatePersonalInfo);

router.put("/updateSchoolInfo", profileUpdateController.updateSchoolInfo);

module.exports = router;

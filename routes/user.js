const express = require("express");

const collegeController = require("../controllers/colleges");

const loginController = require("../controllers/login");

const studentSignUpController = require("../controllers/studentSignUp");

const confirmEmailController = require("../controllers/confirmEmail");

const employeeSignUpController = require("../controllers/employeeSignUp");

const router = express.Router();

router.get("/collegeList", collegeController.getColleges);

router.post("/login", loginController.userLogIn);

router.post("/signup", studentSignUpController.createUser);

router.put("/confirmToken", confirmEmailController.confirmToken);

router.post("/professorSignup", employeeSignUpController.createProfessor);

router.post("/eventManagerSignup", employeeSignUpController.createEventManager);

module.exports = router;

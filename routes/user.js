const express = require("express");

const loginController = require("../controllers/login");

const signUpController = require("../controllers/signUp");

const collegeController = require("../controllers/colleges");

const router = express.Router();

router.post("/login", loginController.userLogIn);
router.post("/signup", signUpController.createUser);
router.put("/confirmToken", signUpController.confirmToken);

router.get("/collegeList", collegeController.getColleges);

module.exports = router;

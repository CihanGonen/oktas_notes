const router = require("express").Router();
const authController = require("../controllers/authController");
const authorization = require("../middlewares/authorization");

router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);
router.post("/verifyUser", authorization, authController.verifyUser_post);

module.exports = router;

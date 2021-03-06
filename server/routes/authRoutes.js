const router = require("express").Router();
const authController = require("../controllers/authController");
const authorization = require("../middlewares/authorization");

router.post("/check_signup", authController.check_signup_post);
router.post("/signup", authController.signup_post);
router.post("/check_login", authController.check_login_post);
router.post("/login", authController.login_post);
router.post("/change_pass", authController.change_password_post);
router.delete("/account_delete/:userId", authController.account_delete);
router.post("/verifyUser", authorization, authController.verifyUser_post);

module.exports = router;

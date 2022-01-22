const router = require("express").Router();
const generalController = require("../controllers/generalController");
const authorization = require("../middlewares/authorization");

router.post("/note", generalController.note_post);
router.post("/sendVerifEmail", generalController.verifEmail_post);

module.exports = router;

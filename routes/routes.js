var express = require("express")
var router = express.Router();
var UsersController = require("../controllers/UsersController");
var AdminAuth = require("../middleware/AdminAuth");

router.post('/user', UsersController.create);
router.get('/user', AdminAuth, UsersController.index);
router.get('/user/:id', AdminAuth, UsersController.findUser);
router.put('/user', AdminAuth, UsersController.edit);
router.delete('/user/:id', AdminAuth, UsersController.delete);
router.post("/recoverypassword", UsersController.recoveryPassword);
router.post("/changepassword", UsersController.changePassword);
router.post("/login", UsersController.login);

module.exports = router;
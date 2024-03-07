const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
router.get("", (req, res) => {
    res.send("xin chào");
});
// authMiddleware.authenticateToken,
router.post("/login", userController.login);

router.post("/register", userController.addUser);
router.get(
    "/account/list",
    authMiddleware.authenticateToken,
    userController.getUsers
);
module.exports = router;

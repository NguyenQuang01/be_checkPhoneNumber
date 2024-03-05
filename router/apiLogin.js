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
router.get("/:id", (req, res) => {
    res.json({ name: `id: ${req.params.id}` });
});
module.exports = router;

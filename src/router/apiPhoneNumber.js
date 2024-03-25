const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const userController = require("../controllers/userController");
router.get("", (req, res) => {
    res.send("xin chào");
});
// authMiddleware.authenticateToken,
router.post(
    "/checkPhone",
    upload.single("excelFile"),
    userController.checkPhone
);
router.post("/checkOnlyPhone", userController.checkOnlyPhone);

module.exports = router;

const express = require("express");

const { validateUser } = require("../middlewares/validateUser");

const {
    loginUser,
    createUser,
    logoutUser,
    editUser,
    aboutUser,
    deleteUser,
    updateImage,
} = require("../controllers/user");
const isAuthenticated = require("../middlewares/isAuthenticated");
// const isCurrentUser = require("../middlewares/isCurrentUser");

const upload = require("../utils/ImageUpload");

const router = express.Router();

router.get("/", isAuthenticated, aboutUser);
router.post("/login", loginUser);
router.post("/signup", upload.single("profile"), validateUser, createUser);
router.get("/logout", logoutUser);
router.delete("/delete", isAuthenticated, deleteUser);
router.post("/edit", isAuthenticated, editUser);
router.post("/image", upload.single("profile"), isAuthenticated, updateImage);

module.exports = router;

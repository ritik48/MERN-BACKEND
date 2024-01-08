const express = require("express");

const { loginUser, createUser, logoutUser, editUser, aboutUser, deleteUser } = require("../controllers/user");
const isAuthenticated = require("../middlewares/isAuthenticated");
// const isCurrentUser = require("../middlewares/isCurrentUser");

const router = express.Router();

router.get("/", isAuthenticated, aboutUser);
router.post("/login", loginUser);
router.post("/signup", createUser);
router.get("/logout", logoutUser);
router.delete("/delete", isAuthenticated, deleteUser);
router.post("/edit", isAuthenticated, editUser);

module.exports = router;

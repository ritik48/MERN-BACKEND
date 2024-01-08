const express = require("express");

const router = express.Router();

const { loginAdmin, createAdmin, aboutAdmin, logoutAdmin,editUser, getUser, getAllUsers, editAdmin, deleteUser, deleteAdmin } = require("../controllers/admin");
const isAdminAuthenticated = require("../middlewares/isAdminAuthenticated");

router.get("/", isAdminAuthenticated, aboutAdmin);
router.post("/login", loginAdmin);
router.post("/signup", createAdmin);
router.get("/logout", logoutAdmin);
router.get("/user-list", isAdminAuthenticated, getAllUsers);

router.post("/edit/:id", isAdminAuthenticated, editUser);
router.post("/edit", isAdminAuthenticated, editAdmin);
router.delete("/delete/:id", isAdminAuthenticated, deleteUser);
router.delete("/delete", isAdminAuthenticated, deleteAdmin);

router.get("/user/:id", isAdminAuthenticated, getUser);


module.exports = router;
const Admin = require("../models/admin/admin.model");
const User = require("../models/user/user.model");

const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");

module.exports.loginAdmin = async (req, res, next) => {
    try {
        const { phone, password, email } = req.body;

        if (!phone && !email) {
            throw new ExpressError(400, "Provide either email or phone");
        }
        if (!password) {
            throw new ExpressError(400, "Password cannot be empty");
        }

        const admin = email
            ? await Admin.findOne({ email })
            : await Admin.findOne({ phone });

        if (!admin) {
            throw new ExpressError(404, "Admin does not exists.");
        }

        const isPasswordValid = await admin.validatePassword(password);
        if (!isPasswordValid) {
            throw new ExpressError(401, "Invalid credentials");
        }

        //generate access token
        const accessToken = jwt.sign(
            {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
            },
            process.env.ADMIN_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpsOnly: true,
                secure: true,
                sameSite: "None",
            })
            .json({ msg: "admin logged in successfully.", accessToken });
    } catch (err) {
        next(err);
    }
};

module.exports.createAdmin = async (req, res, next) => {
    try {
        const { email, phone, password, name } = req.body;
        if (!phone && !email) {
            throw new ExpressError(400, "Provide either email or phone");
        }
        if (!password) {
            throw new ExpressError(400, "Password cannot be empty");
        }

        const admin = new Admin({ email, phone, password, name });
        const savedAdmin = await admin.saveAdmin();

        res.status(201).json({
            msg: "admin created successfully",
            admin: savedAdmin,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await User.find({});

        res.status(200).json({ "user-list": allUsers });
    } catch (err) {
        next(err);
    }
};

module.exports.getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
};

module.exports.editAdmin = async (req, res, next) => {
    try {
        const { email, phone, name } = req.body;

        if (!(email || phone) && !name) {
            throw new ExpressError(400, "Name and phone cannot be empty");
        }

        const admin = await Admin.findByIdAndUpdate(req.admin._id, {
            email,
            phone,
            name,
        });
        // user.name = name;
        // user.password = password;
        // const updatedUser = await user.saveUser();

        res.status(200).json({
            msg: "User details successfully updated",
            admin: admin,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.aboutAdmin = async (req, res, next) => {
    try {
        res.status(200).json({ admin: req.admin });
    } catch (err) {
        next(err);
    }
};

module.exports.deleteAdmin = async (req, res, next) => {
    try {
        await Admin.deleteOne({ _id: req.admin._id });

        res.status(200)
            .clearCookie("accessToken")
            .json({ msg: "admin deleted successfully" });
    } catch (err) {
        next(err);
    }
};

module.exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        await User.deleteOne({ _id: id });

        res.status(200).json({ meesage: "deleted successfully" });
    } catch (err) {
        next(err);
    }
};

module.exports.editUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email, phone, name } = req.body;

        if (!(email || phone) && !name) {
            throw new ExpressError(400, "Name and phone cannot be empty");
        }

        const user = await User.findByIdAndUpdate(id, { email, phone, name });
        // user.name = name;
        // user.password = password;
        // const updatedUser = await user.saveUser();

        res.status(200).json({
            msg: "User details successfully updated",
        });
    } catch (err) {
        next(err);
    }
};

module.exports.logoutAdmin = async (req, res, next) => {
    try {
        res.status(200)
            .clearCookie("accessToken", {
                httpsOnly: true,
                secure: true,
                sameSite: "None",
            })
            .json({ msg: "Admin logged out successfully." });
    } catch (err) {
        next(err);
    }
};

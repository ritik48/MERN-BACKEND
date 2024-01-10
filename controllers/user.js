const User = require("../models/user/user.model");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");

module.exports.loginUser = async (req, res, next) => {
    try {
        console.log(req.body);
        const { phone, password, email } = req.body;

        if (!email && !phone) {
            throw new ExpressError(400, "Provide either email or phone");
        }
        if (!password) {
            throw new ExpressError(400, "Password cannot be empty");
        }

        const user = email
            ? await User.findOne({ email })
            : await User.findOne({ phone });

        if (!user) {
            throw new ExpressError(404, "User does not exists.");
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new ExpressError(401, "Invalid credentials");
        }

        //generate access token
        const accessToken = jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            process.env.USER_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpsOnly: true,
                secure: true,
                sameSite: "None",
            })
            .json({ msg: "user logged in successfully.", accessToken });
    } catch (err) {
        next(err);
    }
};

module.exports.createUser = async (req, res, next) => {
    try {
        const { email, phone, password, name } = req.body;

        if (!phone && !email) {
            throw new ExpressError(400, "Provide either email or phone");
        }
        if (!password) {
            throw new ExpressError(400, "Password cannot be empty");
        }

        let user;
        if (email) {
            const existEmail = await User.findOne({ email });
            if (existEmail) {
                throw new ExpressError(400, "Email already exists");
            }
            console.log("in email");
            user = new User({
                email,
                password,
                name,
                image: req.file.filename,
            });
        }
        if (phone) {
            console.log("in phone");
            const existPhone = await User.findOne({ phone });
            if (existPhone) {
                throw new ExpressError(400, "Phone no. already exists");
            }
            user = new User({
                phone,
                password,
                name,
                image: req.file.filename,
            });
        }
        if (email && phone) {
            user = new User({
                phone,
                password,
                name,
                email,
                image: req.file.filename,
            });
        }
        const savedUser = await user.saveUser();

        //generate access token
        const accessToken = jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            process.env.USER_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        res.status(201)
            .cookie("accessToken", accessToken, {
                httpsOnly: true,
                secure: true,
                sameSite: "None",
            })
            .json({
                msg: "user created successfully",
                user: savedUser,
            });
        // res.status(200).json({ msg: req.body, file: req.file });
    } catch (err) {
        next(err);
    }
};

module.exports.editUser = async (req, res, next) => {
    try {
        const { email, phone, name } = req.body;

        if (!(email || phone) && !name) {
            throw new ExpressError(400, "Name and phone cannot be empty");
        }

        const user = await User.findByIdAndUpdate(req.user._id, {
            email,
            phone,
            name,
        });
        // user.name = name;
        // user.password = password;
        // const updatedUser = await user.saveUser();

        res.status(200).json({
            msg: "User details successfully updated",
            userUpdated: user,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.aboutUser = async (req, res, next) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (err) {
        next(err);
    }
};

module.exports.updateImage = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            image: req.file.filename,
        });
        res.status(200).json({ message: "image updated successfully." });
    } catch (err) {
        next(err);
    }
};

module.exports.deleteUser = async (req, res, next) => {
    try {
        await User.deleteOne({ _id: req.user._id });

        res.status(200)
            .clearCookie("accessToken", {
                httpsOnly: true,
                secure: true,
                sameSite: "None",
            })
            .json({ msg: "user deleted successfully" });
    } catch (err) {
        next(err);
    }
};

module.exports.logoutUser = async (req, res, next) => {
    try {
        res.status(200)
            .clearCookie("accessToken", {
                httpsOnly: true,
                secure: true,
                sameSite: "None",
            })
            .json({ msg: "User logged out successfully." });
    } catch (err) {
        next(err);
    }
};

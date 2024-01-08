const jwt = require("jsonwebtoken");
const User = require("../models/user/user.model");
const ExpressError = require("../utils/ExpressError");

function verifyToken(encryptedToken, secret) {
    try {
        const token = jwt.verify(encryptedToken, secret);
        console.log("token = ", token);
        return token;
    } catch (err) {
        if (err.name == "JsonWebTokenError") {
            throw new ExpressError(
                500,
                "Token validatioon failed (failed signature"
            );
        } else {
            throw new ExpressError(500, err);
        }
    }
}

async function isAuthenticated(req, res, next) {
    try {
        const encryptedToken = req.cookies?.accessToken;

        if (!encryptedToken) {
            throw new ExpressError(401, "You are not authenticated");
        }
        const token = verifyToken(
            encryptedToken,
            process.env.USER_ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(token);
        req.user = user;

        next();
    } catch (err) {
        next(err);
    }
}

module.exports = isAuthenticated;

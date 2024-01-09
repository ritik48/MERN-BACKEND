const ExpressError = require("../utils/ExpressError");
const Admin = require("../models/admin/admin.model");
const jwt = require("jsonwebtoken");

function verifyToken(encryptedToken, secret) {
    try {
        const token = jwt.verify(encryptedToken, secret);
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

const isAdminAuthenticated = async (req, res, next) => {
    try {
        const encryptedToken = req.cookies?.accessToken;
        
        if (!encryptedToken) {
            throw new ExpressError(401, "You are not authenticated !!!");
        }

        const token = verifyToken(
            encryptedToken,
            process.env.ADMIN_ACCESS_TOKEN_SECRET
        );
        const admin = await Admin.findById(token);
        if (!admin) {
            throw new ExpressError(401, "You are not authenticated !!!");
        }
        req.admin = admin;

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = isAdminAuthenticated;

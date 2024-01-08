const User = require("../models/user/user.model");
const ExpressError = require("../utils/ExpressError");

function isCurrentUser(req, res, next) {
    try {
        const { id } = req.params;

        if (!req.user._id.equals(id)) {
            throw new ExpressError(401, "You are not authorized to edit this");
        }
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = isCurrentUser;

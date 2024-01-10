const userSchema = require("../schemas");
const ExpressError = require("../utils/ExpressError");

function validateUser(req, res, next) {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) {
            const msg = error.details.map((err) => err.message).join(" ");
            throw new ExpressError(400, msg);
        }
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { validateUser };

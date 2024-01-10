const Joi = require("joi");

const userSchema = Joi.object({
    name: Joi.string().min(4).max(10).required(),
    password: Joi.string().min(3).required(),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.number().min(10).max(10),
});

module.exports = userSchema;
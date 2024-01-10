const Joi = require("joi");

const userSchema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    password: Joi.string().min(3).required(),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.number().min(6000000000).max(9999999999),
});

module.exports = userSchema;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
    },
    email: {
        type: String,
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User",
    },
    image: {
        type: String,
        required: true
    }
});

userSchema.methods.saveUser = async function () {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    const saveUser = await this.save();
    return saveUser;
};

userSchema.methods.validatePassword = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
};

const User = mongoose.model("user", userSchema);

module.exports = User;

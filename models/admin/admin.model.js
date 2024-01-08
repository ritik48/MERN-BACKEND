const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const adminSchema = Schema({
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
        default: "Admin",
    },
});

adminSchema.methods.saveAdmin = async function () {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    const saveAdmin = await this.save();
    return saveAdmin;
};

adminSchema.methods.validatePassword = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
};

const Admin = new mongoose.model("admin", adminSchema);
module.exports = Admin;

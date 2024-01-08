require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const ExpressError = require("./utils/ExpressError");
const cookieParser = require("cookie-parser");
const isAuthenticated = require("./middlewares/isAuthenticated");
const cors = require("cors");

const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}));

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3001/");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
// });

async function connectDb() {
    await mongoose.connect("mongodb://127.0.0.1:27017/assignment");
    console.log("Database connected.");
}

app.use("/user", userRoute);
app.use("/admin", adminRoute);

// app.get("/logout", (req, res) => {
//     res.status(200).clearCookie("accessToken").json({ msg: "user logged out" });
// });

// app.get("/restricted", isAuthenticated, (req, res, next) => {
//     console.log("\n\nAuthentication successfull\n\n");
//     res.status(200).json({ msg: "this is a secret", user: req.user });
// });

app.use((err, req, res, next) => {
    const { status = 500, message = "Something Went Wrong !!!" } = err;

    res.status(status).json({ message: message });
});

// app.listen(3000, () => console.log("SERVER STARTED ON PORT 3000..."));
connectDb()
    .then(() => {
        app.listen(3000, () => console.log("Listening on port 3000...."));
    })
    .catch((err) => console.log("Cannot connect to Database."));

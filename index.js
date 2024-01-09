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

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "https://mern-frontend-vert-one.vercel.app",
        credentials: true,
    })
);

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3001/");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
// });

const MONGO_URL =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assignment";

const PORT = process.env.PORT || 3000;

async function connectDb() {
    await mongoose.connect(MONGO_URL);
    console.log("Database connected.");
}

app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.get("/", (req, res) => {
    res.json({ msg: "test" });
});

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
        app.listen(PORT, () => console.log(`Listening on port ${PORT}....`));
    })
    .catch((err) => console.log("Cannot connect to Database."));

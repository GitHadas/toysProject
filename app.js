const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/user.routes");
const toyRoutes = require("./routes/toy.routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", userRoutes);
app.use("/toys", toyRoutes);

app.use((error, req, res, next) => {
    console.log("error from the app=> ", error);
    return res.status(400).send({ msg: error.message });
})

module.exports.app = app;
const { app } = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const mongoURL = process.env.MONGO_URL;

const connectToDB = () => {
    mongoose.connect(mongoURL)
        .then((connection) => {
            console.log(`connected to database: ${mongoURL}`);
        }).catch((error) => {
            console.error("Error to connect to database");
            console.error(error);
        });
}
connectToDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`the server is running on port ${PORT}`);
})
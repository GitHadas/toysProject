const { Schema, model, default: mongoose } = require("mongoose");

const toySchema = new Schema({

    name: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    img_url: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    date_created: {
        type: Date,
        default: new Date()
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Toy = model("Toy", toySchema);
module.exports.Toy = Toy;
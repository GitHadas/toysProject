const { Types } = require("mongoose");
const { Toy } = require("../models/toy.model");
const Joi = require("joi");

exports.getAll = async (req, res, next) => {
    try {
        const perPage = 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * perPage;
        const toys = await Toy.find().skip(skip).limit(perPage).populate('user_id');
        res.send(toys);
    } catch (error) {
        next(error);
    }
}

exports.search = async (req, res, next) => {
    try {
        const searchQuery = req.query.s;
        const perPage = 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * perPage;
        let toys;

        if (searchQuery)
            toys = await Toy.find({ $or: [{ name: searchQuery.toLowerCase() }, { info: searchQuery.toLowerCase() }] })
                .skip(skip).limit(perPage).populate('user_id');
        else
            toys = await Toy.find().skip(skip).limit(perPage).populate('user_id');

        res.send(toys);
    } catch (error) {
        next(error);
    }
};

exports.getByCategory = async (req, res, next) => {
    try {
        const { catname } = req.params;
        const perPage = 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * perPage;

        const toys = await Toy.find({ category: catname.toLowerCase() }).skip(skip).limit(perPage).populate('user_id');

        res.send(toys);
    } catch (error) {
        next(error);
    }
};


exports.createToy = async (req, res, next) => {
    try {
        const body = req.body;
        const user_id = res.locals.user_id;

        const validate = joiSchema.createToy.validate(body);
        if (validate.error)
            throw Error(validate.error);
        const newToy = new Toy(body);
        newToy.user_id = new Types.ObjectId(user_id);
        await newToy.save();
        res.status(201).send(newToy);
    } catch (error) {
        next(error);
    }
}

exports.updateToy = async (req, res, next) => {
    try {
        const { editId } = req.params;
        const updates = req.body;
        const user_id = res.locals.user_id;

        const validate = joiSchema.update.validate(updates);
        if (validate.error)
            throw Error(validate.error);
        let toy = await Toy.findOne({ _id: editId });
        if (!toy)
            return res.status(404).send({ msg: "Toy not found" });
        if (String(toy.user_id) !== user_id)
            return res.status(404).send({ msg: "You cannot update this toy" });

        toy = await Toy.findByIdAndUpdate(editId, updates, { new: true });
        res.status(200).send(toy);
    } catch (error) {
        next(error);
    }
}

exports.deleteToy = async (req, res, next) => {
    try {
        const { delId } = req.params;
        const user_id = res.locals.user_id;

        let toy = await Toy.findOne({ _id: delId });
        if (toy.user_id != user_id)
            return res.status(404).send({ msg: "You cannot update this toy" });

        toy = await Toy.findByIdAndDelete(delId);
        res.status(201).send(toy);
    } catch (error) {
        next(error);
    }
}

exports.getByRange = async (req, res, next) => {
    try {
        const perPage = 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * perPage;
        const { min, max } = req.query;

        const priceQuery = {};
        if (min !== undefined) priceQuery.$gte = parseInt(min);
        if (max !== undefined) priceQuery.$lte = parseInt(max);

        const toys = await Toy.find({ price: priceQuery }).skip(skip).limit(perPage).populate('user_id');
        res.status(201).send(toys);
    } catch (error) {
        next(error);
    }
}

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const toy = await Toy.findOne({ _id: id }).populate('user_id');
        res.send(toy);
    } catch (error) {
        next(error);
    }
}

const joiSchema = {
    createToy: Joi.object().keys({
        name: Joi.string().required(),
        info: Joi.string().required(),
        category: Joi.string().required(),
        img_url: Joi.string(),
        price: Joi.number().required(),
        date_created: Joi.date()
    }),
    update: Joi.object().keys({
        name: Joi.string(),
        info: Joi.string(),
        category: Joi.string(),
        img_url: Joi.string(),
        price: Joi.number(),
        date_created: Joi.date()
    })
}
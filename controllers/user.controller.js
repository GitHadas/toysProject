const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { User } = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

const checkIfUserExists = async (email) => {
    const user = await User.findOne({ email });
    if (user) return user;
    return false;
}

exports.createUser = async (req, res, next) => {
    const body = req.body;
    try {
        const validate = joiSchema.createUser.validate(body);
        if (validate.error)
            throw Error(validate.error);

        if (await checkIfUserExists(body.email))
            throw new Error("User already exist in the system");

        const hash = await bcrypt.hash(body.password, 12);
        body.password = hash;

        const newUser = new User(body);
        await newUser.save();
        return res.status(201).send(newUser);

    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const body = req.body;
    try {
        const validate = joiSchema.login.validate(body);
        if (validate.error)
            throw Error(validate.error);
        const user = await checkIfUserExists(body.email);
        if (!user || !await bcrypt.compare(body.password, user.password))
            throw new Error('Password or email not valid');

        const token = generateToken(user)
        return res.send({ user, token });

    } catch (error) {
        next(error);
    }
};

const joiSchema = {
    createUser: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email({ tlds: { allow: ['com'] } }).error(() => Error('email is not valid')),
        password: Joi.string().max(20),
        date_created: Joi.date(),
        role: Joi.string().valid('user', 'admin')
    }),
    login: Joi.object().keys({
        email: Joi.string().email({ tlds: { allow: ['com'] } }).error(() => Error('email is not valid')),
        password: Joi.string().max(20)
    })
}
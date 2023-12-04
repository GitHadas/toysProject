const { decodeToken } = require("../utils/jwt");

exports.auth = () => {
    return async function (req, res, next) {
        let token = req.headers["authorization"];
        if (!token) return res.sendStatus(401);
        token = token.split(" ")[1];
        try {
            const payload = decodeToken(token);
            res.locals.user_id = payload?._doc?._id;
            next();
        } catch (error) {
            next(error);
        }
    }
}
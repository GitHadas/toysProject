const jwt = require("jsonwebtoken");

/*
*@param {object} payload
*@return (string)
*/

exports.generateToken = (payload) => {
    try {
        const token = jwt.sign({ ...payload }, '888%$', { expiresIn: '2h' });
        return token;
    } catch (error) {
        throw Error(error.message);
    }
}

/*
*@param {object} payload
*@return (string)
*/

exports.decodeToken = (token) => {
    try {
        const payload = jwt.verify(token, '888%$');
        return payload;
    } catch (error) {
        throw Error(error.message);
    }
}
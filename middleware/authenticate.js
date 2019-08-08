const User = require('../models/user');

const authenticate = async(req, res, next) => {

    let token = req.header('x-auth');

    try
    {
        const foundUser = await User.findByToken(token);
    
        if(!foundUser) {
            throw new Error();
        }
        req.user = foundUser;
        req.token = token;

        console.log('Access Granted -- Enjoy Your Stay')
        next();
    }
    catch
    {
        console.log('Access Denied -- Leave Country Immediately')
        res.status(404).send({ error: 'Authentication Failed. Leave or be Destroyed'})
    }

}

    module.exports = authenticate;
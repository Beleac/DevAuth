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

        next();
        console.log('Access Granted -- Enjoy Your Stay')
    }
    catch(err)
    {
        res.status(401).send({ error: 'Authentication Failed. Leave or be Destroyed'})
        console.log('Access Denied -- Leave Country Immediately')
        console.log(err)
    }

}

    module.exports = authenticate;
    //
    //
    //
    //
    //
    //
    //



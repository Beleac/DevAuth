const User = require('../models/user');

const authenticate = (req, res, next) => {

    let token = req.header('x-auth');

    if (token == 'MeatballSub')

    {
    req.token = token;
    next();
    console.log('Access Granted -- Enjoy Your Stay')
    }
    else
    {
        console.log('Access Denied -- Leave Country Immediately')
    }

}

module.exports = authenticate;
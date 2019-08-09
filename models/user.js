const mongoose= require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 5
    },
    tokens: [{
        access: {
        type: String,
        required: true
        },

    token: {
        type: String,
        required: true
    }

    }]


}, {timestamps: true})

UserSchema.methods.generateAuthToken = async function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();



    user.tokens = user.tokens.concat([{ access, token}]);

    const savedToken = await user.save();

    return token;
}

UserSchema.statics.findByToken = async function(token) {
    let User = this;
    var decoded;

    try 
    { 
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }

    catch(err)
    {
        return Promise.reject();
        console.log(err);
    }

    try
    {
        const foundUser = await User.findOne ({
            "_id": decoded._id,
            "tokens.token": token,
            "tokens.access": "auth"
        });

        return foundUser;
    }
    catch(err)
    {
        return Promise.reject();
        console.log(err);
    }
}

UserSchema.statics.findByCredentials = async function(email, password) {

    let User = this;

    try {
        const foundUser = await User.findOne({email});

    if(!foundUser)
    {
        return Promise.reject();
    }
    
    const matchedPassword = await foundUser.comparePassword(password);
    console.log(`matchedPassword: ${matchedPassword}`);
    console.log(`foundUser: ${foundUser}`);
    return Promise.resolve(foundUser) 

    }

    catch (err) {
        return Promise.reject(err);
        console.log(err)
    }

}

UserSchema.methods.comparePassword = async function(password) {
    const match = await bcrypt.compare(password, this.password);
    if(!match) 
    {
        console.log('Password is invalid')
        return Promise.reject
    } 
    console.log(`comparePassword match is: ${match}`)
    console.log('Password is a match.')
    return Promise.resolve(match);
}

UserSchema.pre('save', function(next) {
    let user = this;
    if(user.isModified('password'))
    {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next();
            })
        });
    }
    else
    {
        next();
    }
})

var User = mongoose.model('User', UserSchema);



module.exports = User;
















































































console.log(`"No, go die anwhere, not just in a hole" - Zeeshan 8/9/19 9:56`)
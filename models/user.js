const mongoose= require('mongoose');
const jwt = require('jsonwebtoken');

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
        minlength: 6
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

UserSchema.statics.findByCredentials = async function(email, password) {

    let User = this;


    try {const foundUser = await User.findOne({ email: email, password: password});

        if(!foundUser) {
            return Promise.reject();
        }
        return Promise.resolve(foundUser)

    }   catch (err) {
        return Promise.reject(err);
        console.log(err)
    }

}

var User = mongoose.model('User', UserSchema);



module.exports = User;
















































































console.log(`"Go die in a hole" - Zeeshan 8/8/19 9:51`)
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const task = require('./task');
const { translateAliases } = require('./task');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type: Number,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number');
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is not valid');
            }
        }
    },
    password: {
        type: String,
        required : true,
        minLength : 6,
    },
    tokens: [{
        token:{
            type:String,
            required : true
        }
    }],
    avatar : {
        type:Buffer
    }
},{ timestamps : true });

//accessible on models
UserSchema.statics.findByCredentials = async function(email,password){
    const user = await User.findOne({email});
    if(!user){
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Wrong Password');
    }
    return user;
};

//accessible on instances
UserSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id : user._id.toString()} , process.env.JWT_SECRET_KEY);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

UserSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

UserSchema.methods.getPublicProfile = async function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
    //return { _id : user._id , name : user.name, email : user.email, age : user.age, tokens : user.tokens};
}

// This way we are creating bidirectional relationship for users and task. We can find tasks related to given user without actually storing that field in user object.

UserSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'userId'
})


//whenever user is deleted delete the related tasks also.
UserSchema.pre('remove', async function(next){
    const user = this
    await task.deleteMany({userId:user._id});
    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User; 
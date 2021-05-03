const mongoose = require('mongoose');

const connectionUrl = process.env.MONGODB_URL;

mongoose.connect(connectionUrl, { useNewUrlParser : true, useCreateIndex : true })

/* const User = mongoose.model('User', {
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
    }
}) */

/* const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}); */


/* const me = new User({
    name : 'Rashi',
    age: 27
})

me.save().then((response) => {
    console.log(response)
}).catch((error) => {
    console.log('error');
}) */

/* const task1 = new Task({
    description:'task - 1',
    completed: false
});

task1.save().then((response) => {
    console.log(response)
}).catch((error) => {
    console.log('error');
}) */

/* const me = new User({
    name : 'Rashi',
    email: 'abc@gmsi.com'
});

me.save().then((response) => {
    console.log(response)
}).catch((error) => {
    console.log('error');
}); */

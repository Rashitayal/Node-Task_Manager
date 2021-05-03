const express = require('express');
require('./db/mongoose');
const UserModel = require('./models/user');
const TaskModel = require('./models/task')
const UserRouter = require('./routers/user');
const TaskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

//write a middleware to authenticate the user by token to access resources other than login or create user



app.use(express.json());
app.use(UserRouter);
app.use(TaskRouter);

/* const bcrypt = require('bcryptjs');
const myFunc = async () => {
    const password = '123456'
    const hashedPassword =await bcrypt.hash(password,8);
    console.log(password);
    console.log(hashedPassword);
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log(isMatch);
}

myFunc(); */

/* const jwt = require('jsonwebtoken');
const myFunc = async () => {
    //create web token
    const token = await jwt.sign( {_id: 'abc123'}, 'secretkey', {expiresIn: '0 seconds'});
    console.log(token);

    //verify token

    const data = jwt.verify(token, 'secretkey');
    console.log(data);
}
myFunc(); */

//given a task.. let's find user details:

/* const myFunc = async () => {
    const task = await TaskModel.findById('608d888fd361b66243ad1661');
    await task.populate('userId').execPopulate();
    console.log(task);
}
myFunc(); */

//given userId.. let's find his tasks:

/* const myFunc = async () => {
    const user = await UserModel.findById('608bde732dbfb63777b4c8bd');
    await user.populate('tasks').execPopulate();
    console.log(user.tasks);
}

myFunc(); */

//support file upload

/* const multer = require('multer');

const upload = multer({
    dest:'images',
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,callback){
        if(!file.originalname.endsWith('.pdf')){
            return callback(new Error('Please upload a PDF type file'));
        }
        callback(undefined, true);
    }
});

app.post('/upload', upload.single('upload'), (req,res) => {
    res.send();
}) */

app.listen(port);
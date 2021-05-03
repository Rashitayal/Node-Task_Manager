const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        if(token){
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user  = await userModel.findOne({_id:decoded._id, 'tokens.token':token});
            if(user){
                req.user = user;
                next();
            }
            else{
                return res.status(400).send('Auth Token not valid');
            }
        }else{
            return res.status(400).send('invalid request');
        }
    }catch(e){
        res.status(500).send('error occurred while authenticating')
    }
};

module.exports = auth;
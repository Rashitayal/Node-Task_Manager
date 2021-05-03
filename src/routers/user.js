const express = require('express');
const router = new express.Router();
const authMiddleware = require('../middleware/auth');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const emailService = require('../emails/account')

//we pass middleware to a particular route as second argument before running its implementation function.

router.get('/users', authMiddleware, async (req,res) => {
    try{
        const users = await UserModel.find({});
        res.send(users);
    } catch(e){
        res.status(500).send(e)
    }
    
    /* UserModel.find({}).then( (users) => {
        res.send(users);
    } ).catch( (e) => res.status(400).send(e) ) */
} );

router.get('/users/:id',authMiddleware, async (req,res) => {
    try{
        let user = await UserModel.findById(req.params.id);
        if(!user){
            return res.status(400).send('User Not Found');
        }
        return res.send(await user.getPublicProfile());
    } catch(e){
        return res.status(500).send(e);
    }
    
    //UserModel.findById(req.params.id).then( (user) => { res.send(user) } ).catch( (e) => {res.status(400).send(e) } );
});

router.post('/users', async (req,res) => {
    
    const user = new UserModel(req.body);
    try{
        await user.save();
        const token = await user.generateAuthToken();
        emailService.welcomeDocument(user.email, user.name);
        res.status(201).send({user:await user.getPublicProfile(),token});
    } catch(e){
        res.status(500).send(e);
    }
    
    //user.save().then( () => { res.status(201).send(user) } ).catch( (e) => { res.status(400).send(e) } );

} );

router.patch( '/users/:id' , authMiddleware,async (req,res) => {
    try{
        // const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidatore: true })
        const userProperties = ['name', 'age', 'email', 'password'];
        const requestProperties = Object.keys(req.body);
        
        const validRequest = requestProperties.every(val => {
            return userProperties.includes(val);
        });
        if(!validRequest){
            return res.status(400).send('invalid updates');
        }

        const user = await UserModel.findById(req.params.id);

        if(!user){
            return res.status(400).send('User Not Found');
        }
        
        requestProperties.forEach( (prop) => {
            user[prop] = req.body[prop];
        })

        await user.save()
        res.send(await user.getPublicProfile());
    }catch(e){
        res.status(500).send(e);
    }
} )

router.delete( '/users/:id' ,authMiddleware, async (req,res) => {
    try{
        const user = await UserModel.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(400).send('User Not Found');
        }
        res.send(await user.getPublicProfile());
    } catch (e) {
        res.status(500).send(e);
    }
} )

router.post('/users/login' , async(req, res) => {
    try{
        const user = await UserModel.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send(await user.getPublicProfile(),token);

    } catch(e) {
        res.status(400).send(e);
    }
});

router.post('/users/logout', authMiddleware, async(req,res) => {
    try{
        const user = await UserModel.findById(req.body._id);
        const token = req.header('Authorization').replace('Bearer ','');
        user.tokens = user.tokens.filter((usertoken) => {
            return usertoken.token !== token; 
        })
        await user.save();
        res.send(await user.getPublicProfile());
    } catch(e){
        res.status(400).send(e);
    }
})

router.post('/users/logout/all', authMiddleware, async(req,res) => {
    try{
        const user = await UserModel.findById(req.body._id);
        user.tokens = [];
        await user.save();
        res.send(await user.getPublicProfile());
    } catch(e){
        res.status(400).send(e);
    }
})

const avatar = multer({
    // dest:'avatars',
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|JPG)$/)){
            return cb(new Error('Please upload an image type file'));
        }
        cb(undefined, true);
    }
})

router.post('/users/avatar',authMiddleware, avatar.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send('Image saved successfully');
}, (error, req, res, next) => {
    res.status(400).send({error:error.message});
})

router.get('/users/:id/avatar',async(req,res) => {
    try{
        const user = await UserModel.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type','image/png');
        res.send(user.avatar);
    } catch(e){
        res.status(400).send(e);
    }
})
module.exports = router;
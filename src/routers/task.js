const express = require('express');
const router = new express.Router();
const TaskModel = require('../models/task');
const authMiddleware = require('../middleware/auth');

//Get Tasks where completed = true /tasks?completed=true

//enable pagination. /tasks?limit=10&skip=20

// sort : 1 means ascending, -1 means descending. /tasks?sortBy=createdAt:desc

router.get('/tasks', authMiddleware, async (req,res) => {
    const match = {};
    const sort = {};
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try{
        await req.user.populate({
            path : 'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send(e)
    }
    //TaskModel.find({}).then( (tasks) => { res.send(tasks) } ).catch( (e) => { res.status(400).send(e) } );
} )

router.get('/tasks/:id', (req,res) => {
    const task = TaskModel.findById(req.params.id);
    if(!task){
        return res.status(400).send('task not found')
    }
    task.then( (task) => { res.send(task) } ).catch( (e) => {res.status(500).send(e) } );
});

router.post('/tasks', authMiddleware, (req,res) => {

    const task = new TaskModel({...req.body, userId: req.user._id});
    task.save().then( () => { res.status(201).send(task) } ).catch( (e) => { res.status(500).send(e) } );

} )

router.patch( '/tasks/:id' , async (req,res) => {
    try{
        const taskProperties = ['description' , 'completed'];
        const requestProperties = Object.keys(req.body);

        const validRequest = requestProperties.every(val => {
            return taskProperties.includes(val);
        });
        if(!validRequest){
            return res.status(400).send('invalid updates');
        }

        const task = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidatore: true })
        if(!task){
            return res.status(400).send('Task Not Found')
        }
        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
} )

router.delete( '/tasks/:id' , async (req,res) => {
    try{
        const task = await TaskModel.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(400).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
} )

module.exports = router;